import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { CreateTopicRequest } from "./dto/create-topic.request";

@Controller("topics")
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get("/")
  async getAll() {
    return await this.topicService.getAll();
  }

  @Get("/:title")
  async getOne(@Param("title") title: string) {
    return await this.topicService.getOne(title);
  }

  @Post("/")
  async add(@Body() topicData: CreateTopicRequest) {
    return await this.topicService.add(topicData.title, topicData.description);
  }

  @Delete("/:title")
  async remove(@Param("title") title: string) {
    return await this.topicService.remove(title);
  }
}
