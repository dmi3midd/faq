import { IsNotEmpty, IsString, IsUUID, Length, IsEmail } from 'class-validator';

export class AdminDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 16)
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
