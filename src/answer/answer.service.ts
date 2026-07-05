import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnswerEntity } from "./entities/answer.entity";
import { QuestionEntity } from "src/question/entities/question.entity";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // Create a new answer
  // Send a new answer in email
  async answer(answer: CreateAnswerDto): Promise<AnswerEntity> {
    const question = await this.questionRepository.findOne({
      where: { id: answer.questionId },
    });
    if (!question) {
      throw new NotFoundException("Question not found");
    }
    const url = this.configService.getOrThrow<string>("EMAIL_SERVICE_URL");
    let resp = await firstValueFrom(
      this.httpService.post(`${url}/send/email`, {
        to: question.email,
        subject: "Answer to your question",
        body: answer.message,
      }),
    );

    if (resp.status != 202) {
      throw new InternalServerErrorException("Failed to send email");
    }

    const savedAnswer = await this.answerRepository.save(answer);
    return savedAnswer;
  }
}
