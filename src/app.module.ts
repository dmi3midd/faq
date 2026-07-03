import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { QuestionModule } from "./question/question.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
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
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
