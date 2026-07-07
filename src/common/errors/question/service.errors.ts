import { QuestionStatus } from "../../../question/entities/question.entity";

export class QuestionNotFoundError extends Error {
  constructor(questionId: string, status?: QuestionStatus) {
    super(
      `Question ${questionId} not found${status ? ` or already ${status}` : ""}`,
    );
    this.name = "QuestionNotFoundError";
  }
}

export class QuestionNotAssignedError extends Error {
  constructor(questionId: string, status: QuestionStatus) {
    super(`Question ${questionId} is not assigned but ${status}`);
    this.name = "QuestionNotAssignedError";
  }
}
