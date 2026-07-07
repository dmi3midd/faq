import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

export enum QuestionStatus {
  PENDING = "pending",
  RESOLVED = "resolved",
  ASSIGNED = "assigned",
}

@Entity("questions")
export class QuestionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column({
    type: "enum",
    enum: QuestionStatus,
    default: QuestionStatus.PENDING,
  })
  status: QuestionStatus;

  @Column({
    name: "assigned_admin_id",
    nullable: true,
    default: null,
  })
  assignedAdminId: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt: Date;

  @VersionColumn()
  version: number;
}
