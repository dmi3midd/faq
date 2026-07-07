import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAnswerRequest {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  questionId: string;
}
