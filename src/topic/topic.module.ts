import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TopicEntity } from "./entities/topic.entity";
import { TopicController } from "./topic.controller";
import { TopicService } from "./topic.service";

@Module({
  imports: [TypeOrmModule.forFeature([TopicEntity])],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
