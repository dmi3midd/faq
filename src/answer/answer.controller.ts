import { Controller, Post, Body } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswerEntity } from './entities/answer.entity';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) { }

  @Post("/")
  async answer(@Body() answer: CreateAnswerDto): Promise<AnswerEntity> {
    return await this.answerService.answer(answer);
  }

}
