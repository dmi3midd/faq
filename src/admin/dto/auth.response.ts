import { AdminDto } from "./admin.dto";

export class AuthResponse {
  token: string;
  admin: AdminDto;
  expiresAt: number;

  constructor(token: string, admin: AdminDto, expiresAt: number) {
    this.token = token;
    this.admin = admin;
    this.expiresAt = expiresAt;
  }
}
