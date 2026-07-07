import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { QuestionEntity } from "../../question/entities/question.entity";

@Entity("answers")
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
