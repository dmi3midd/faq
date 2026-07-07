import { Module } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { AnswerController } from "./answer.controller";
import { AnswerEntity } from "./entities/answer.entity";
import { QuestionEntity } from "src/question/entities/question.entity";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerEntity, QuestionEntity]),
    HttpModule,
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
