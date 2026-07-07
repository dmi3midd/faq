import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { QuestionEntity, QuestionStatus } from "./entities/question.entity";
import { QuestionNotFoundError } from "../common/errors/question/service.errors";

interface IQuestionService {
  createQuestion(
    email: string,
    subject: string,
    message: string,
  ): Promise<void>;
  getPendingQuestions(): Promise<QuestionEntity[]>;
  getAssignedQuestions(adminId: string): Promise<QuestionEntity[]>;
  assignQuestion(questionId: string, adminId: string): Promise<void>;
  resolveQuestion(questionId: string): Promise<void>;
}

@Injectable()
export class QuestionService implements IQuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async createQuestion(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const newQuestion = this.questionRepository.create({
      email,
      subject,
      message,
    });
    await this.questionRepository.save(newQuestion);
  }

  async getPendingQuestions(): Promise<QuestionEntity[]> {
    return this.questionRepository.find({
      where: {
        assignedAdminId: IsNull(),
        status: QuestionStatus.PENDING,
      },
    });
  }

  async getAssignedQuestions(adminId: string): Promise<QuestionEntity[]> {
    return this.questionRepository.find({
      where: {
        assignedAdminId: adminId,
        status: QuestionStatus.ASSIGNED,
      },
    });
  }

  async assignQuestion(questionId: string, adminId: string): Promise<void> {
    const updateResult = await this.questionRepository.update(
      {
        id: questionId,
        assignedAdminId: IsNull(),
      },
      {
        assignedAdminId: adminId,
        status: QuestionStatus.ASSIGNED,
      },
    );
    if (updateResult.affected === 0) {
      throw new QuestionNotFoundError(questionId, QuestionStatus.ASSIGNED);
    }
  }

  async resolveQuestion(questionId: string): Promise<void> {
    const updateResult = await this.questionRepository.update(
      {
        id: questionId,
        status: QuestionStatus.ASSIGNED,
      },
      {
        status: QuestionStatus.RESOLVED,
      },
    );
    if (updateResult.affected === 0) {
      throw new QuestionNotFoundError(questionId, QuestionStatus.RESOLVED);
    }
  }
}
