import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "./entities/admin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
