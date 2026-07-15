export class AdminAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Admin with email "${email}" already exists`);
    this.name = "AdminAlreadyExistsError";
  }
}

export class AdminNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Admin not found: ${identifier}`);
    this.name = "AdminNotFoundError";
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super("Invalid password");
    this.name = "InvalidPasswordError";
  }
}

export class AdminInactiveError extends Error {
  constructor(email: string) {
    super(`Admin "${email}" is inactive`);
    this.name = "AdminInactiveError";
  }
}
