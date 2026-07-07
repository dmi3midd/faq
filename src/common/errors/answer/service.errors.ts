export class FailedToSendEmailError extends Error {
  constructor(questionId: string) {
    super(`Failed to send email on ${questionId}`);
    this.name = "FailedToSendEmailError";
  }
}
