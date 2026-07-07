import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTopicRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 48)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 128)
  description: string;
}
