import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import e, { Response } from "express";
import { TopicNotFoundError } from "../errors/topic/service.errors";
import {
  QuestionNotFoundError,
  QuestionNotAssignedError,
} from "../errors/question/service.errors";
import { FailedToSendEmailError } from "../errors/answer/service.errors";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof TopicNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof QuestionNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    if (exception instanceof QuestionNotAssignedError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    if (exception instanceof FailedToSendEmailError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
    });
  }
}
