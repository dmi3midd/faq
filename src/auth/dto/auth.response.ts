import { AdminDto } from "./admin.dto";

export class AuthResponse {
  admin: AdminDto;
  refreshToken: string;
  accessToken: string;

  constructor(admin: AdminDto, refreshToken: string, accessToken: string) {
    this.admin = admin;
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
  }
}
