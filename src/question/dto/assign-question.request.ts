import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AssignQuestionRequest {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  adminId: string;
}
