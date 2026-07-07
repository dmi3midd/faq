import { Controller, Post, Body } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { CreateAnswerRequest } from "./dto/create-answer.request";
import { AnswerEntity } from "./entities/answer.entity";

@Controller("answers")
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post("/")
  async answer(@Body() body: CreateAnswerRequest): Promise<AnswerEntity> {
    return await this.answerService.answer(body.message, body.questionId);
  }
}
