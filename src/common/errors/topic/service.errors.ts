export class TopicNotFoundError extends Error {
  constructor(title: string) {
    super(`Topic with title ${title} not found`);
    this.name = "TopicNotFoundError";
  }
}
