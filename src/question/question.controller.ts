import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Patch,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { QuestionService } from "./question.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { QuestionStatus } from "./entities/question.entity";

@Controller("questions")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post("/")
  async sendQuestion(@Body() question: CreateQuestionDto) {
    await this.questionService.createQuestion(question);
    return { message: "Question sent successfully" };
  }

  @Get("/pending")
  async getPendingQuestions() {
    return await this.questionService.getPendingQuestions();
  }

  @Get("/assigned/:adminId")
  async getAssignedQuestions(@Param("adminId") adminId: string) {
    if (!adminId) {
      throw new BadRequestException("adminId is required");
    }
    return await this.questionService.getAssignedQuestions(adminId);
  }

  @Put("/:id")
  async assignQuestion(
    @Param("id") id: string,
    @Body() body: { assignedAdminId: string },
  ) {
    if (!body.assignedAdminId) {
      throw new BadRequestException("assignedAdminId is required");
    }
    await this.questionService.assignQuestion(id, body.assignedAdminId);
    return { message: "Question assigned successfully" };
  }

  @Patch("/:id")
  async resolveQuestion(@Param("id") id: string) {
    await this.questionService.resolveQuestion(id);
    return { message: "Question resolved successfully" };
  }
}
