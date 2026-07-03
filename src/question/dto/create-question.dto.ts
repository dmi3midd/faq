import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  message: string;
}
