import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateQuestionRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 128)
  subject: string;

  @IsNotEmpty()
  @IsString()
  @Length(16, 512)
  message: string;
}
