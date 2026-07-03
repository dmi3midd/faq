import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { QuestionEntity, QuestionStatus } from "./entities/question.entity";
import { CreateQuestionDto } from "./dto/create-question.dto";

interface IQuestionService {
  createQuestion(question: CreateQuestionDto): Promise<void>;
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

  async createQuestion(question: CreateQuestionDto): Promise<void> {
    const newQuestion = this.questionRepository.create(question);
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
        status: QuestionStatus.IN_PROGRESS,
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
        status: QuestionStatus.IN_PROGRESS,
      },
    );
    if (updateResult.affected === 0) {
      throw new BadRequestException("Question not found or already assigned");
    }
  }

  async resolveQuestion(questionId: string): Promise<void> {
    const updateResult = await this.questionRepository.update(
      {
        id: questionId,
        status: QuestionStatus.IN_PROGRESS,
      },
      {
        status: QuestionStatus.RESOLVED,
      },
    );
    if (updateResult.affected === 0) {
      throw new BadRequestException("Question not found or already resolved");
    }
  }
}
