import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  password: string;
}
