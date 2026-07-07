import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnswerEntity } from "./entities/answer.entity";
import { QuestionEntity } from "src/question/entities/question.entity";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import {
  QuestionNotFoundError,
  QuestionNotAssignedError,
} from "src/common/errors/question/service.errors";
import { FailedToSendEmailError } from "src/common/errors/answer/service.errors";
import { QuestionStatus } from "src/question/entities/question.entity";

interface IAnswerService {
  answer(message: string, questionId: string): Promise<AnswerEntity>;
}

@Injectable()
export class AnswerService implements IAnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async answer(message: string, questionId: string): Promise<AnswerEntity> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });
    if (!question) {
      throw new QuestionNotFoundError(questionId);
    }
    if (question.status !== QuestionStatus.ASSIGNED) {
      throw new QuestionNotAssignedError(questionId, question.status);
    }
    const url = this.configService.getOrThrow<string>("EMAIL_SERVICE_URL");
    let resp = await firstValueFrom(
      this.httpService.post(`${url}/send/email`, {
        to: question.email,
        subject: "Answer to your question",
        body: message,
      }),
    );

    if (resp.status != 202) {
      throw new FailedToSendEmailError(questionId);
    }

    const savedAnswer = await this.answerRepository.save({
      message,
      question,
    });
    return savedAnswer;
  }
}
