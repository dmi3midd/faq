import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("admins")
export class AdminEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({
    name: "hash_password"
  })
  password: string;

  @Column({
    name: "is_active",
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;
}
