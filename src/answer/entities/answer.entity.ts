import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { QuestionEntity } from "../../question/entities/question.entity";

export class AnswerEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  message: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @OneToOne(() => QuestionEntity)
  @JoinColumn()
  question: QuestionEntity;
}
