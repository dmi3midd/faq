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
import { CreateQuestionRequest } from "./dto/create-question.request";
import { AssignQuestionRequest } from "./dto/assign-question.request";

@Controller("questions")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post("/")
  async createQuestion(@Body() body: CreateQuestionRequest) {
    await this.questionService.createQuestion(
      body.email,
      body.subject,
      body.message,
    );
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

  @Patch("/assign/:id")
  async assignQuestion(
    @Param("id") id: string,
    @Body() body: AssignQuestionRequest,
  ) {
    await this.questionService.assignQuestion(id, body.adminId);
    return { message: "Question assigned successfully" };
  }

  @Patch("/resolve/:id")
  async resolveQuestion(@Param("id") id: string) {
    await this.questionService.resolveQuestion(id);
    return { message: "Question resolved successfully" };
  }
}
