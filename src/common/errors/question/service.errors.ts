import { QuestionStatus } from "../../../question/entities/question.entity";

export class QuestionNotFoundError extends Error {
  constructor(questionId: string, status?: QuestionStatus) {
    super(
      `Question ${questionId} not found${status ? ` or already ${status}` : ""}`,
    );
    this.name = "QuestionNotFoundError";
  }
}
