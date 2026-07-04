import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { CreateTopicDto } from "./dto/create-topic.dto";

@Controller("topics")
export class TopicController {
  constructor(private readonly topicService: TopicService) { }

  @Get("/")
  async getAll() {
    return await this.topicService.getAll();
  }

  @Get("/:title")
  async getOne(@Param("title") title: string) {
    return await this.topicService.getOne(title);
  }

  @Post("/")
  async add(@Body() topic: CreateTopicDto) {
    return await this.topicService.add(topic);
  }

  @Delete("/:title")
  async remove(@Param("title") title: string) {
    return await this.topicService.remove(title);
  }
}
