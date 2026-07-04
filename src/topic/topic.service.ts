import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TopicEntity } from "./entities/topic.entity";
import { Repository } from "typeorm";
import { CreateTopicDto } from "./dto/create-topic.dto";

interface ITopicService {
  getAll(): Promise<TopicEntity[]>;
  getOne(title: string): Promise<TopicEntity>;
  add(topic: CreateTopicDto): Promise<TopicEntity>;
  remove(title: string): Promise<void>;
}

@Injectable()
export class TopicService implements ITopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private topicRepository: Repository<TopicEntity>,
  ) { }

  async getAll(): Promise<TopicEntity[]> {
    return await this.topicRepository.find();
  }

  async getOne(title: string): Promise<TopicEntity> {
    const topic = await this.topicRepository.findOne({ where: { title } });
    if (!topic) {
      throw new NotFoundException(`Topic with title "${title}" not found`);
    }
    return topic;
  }

  async add(topic: CreateTopicDto): Promise<TopicEntity> {
    const newTopic = this.topicRepository.create(topic);
    return await this.topicRepository.save(newTopic);
  }

  async remove(title: string): Promise<void> {
    await this.topicRepository.delete({ title });
  }
}
