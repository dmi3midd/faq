import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TopicEntity } from "./entities/topic.entity";
import { Repository } from "typeorm";
import { TopicNotFoundError } from "../common/errors/topic/service.errors";

interface ITopicService {
  getAll(): Promise<TopicEntity[]>;
  getOne(title: string): Promise<TopicEntity>;
  add(title: string, description: string): Promise<TopicEntity>;
  remove(title: string): Promise<void>;
}

@Injectable()
export class TopicService implements ITopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private topicRepository: Repository<TopicEntity>,
  ) {}

  async getAll(): Promise<TopicEntity[]> {
    return await this.topicRepository.find();
  }

  async getOne(title: string): Promise<TopicEntity> {
    const topic = await this.topicRepository.findOne({ where: { title } });
    if (!topic) {
      throw new TopicNotFoundError(title);
    }
    return topic;
  }

  async add(title: string, description: string): Promise<TopicEntity> {
    const newTopic = this.topicRepository.create({ title, description });
    return await this.topicRepository.save(newTopic);
  }

  async remove(title: string): Promise<void> {
    await this.topicRepository.delete({ title });
  }
}
