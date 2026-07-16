import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("admins")
export class AdminEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;
}
