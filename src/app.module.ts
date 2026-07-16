import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { QuestionModule } from "./question/question.module";
import { AnswerModule } from "./answer/answer.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    // TypeOrmModule
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.getOrThrow<string>("POSTGRES_HOST"),
        port: configService.getOrThrow<number>("POSTGRES_PORT"),
        username: configService.getOrThrow<string>("POSTGRES_USERNAME"),
        password: configService.getOrThrow<string>("POSTGRES_PASSWORD"),
        database: configService.getOrThrow<string>("POSTGRES_DATABASE"),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    // Modules
    QuestionModule,
    AnswerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
