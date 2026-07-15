import { Controller, Post, Body, Headers, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegistrationRequest } from "./dto/registration.request";
import { LoginRequest } from "./dto/login.request";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/")
  async registration(@Body() body: RegistrationRequest) {
    const admin = await this.authService.registration(body.username, body.email, body.password);
    return { adminId: admin.id };
  }

  @Post("/login")
  async login(@Body() body: LoginRequest) {
    return await this.authService.login(body.email, body.password);
  }

  @Post("/logout")
  async logout(@Headers("authorization") authorization?: string) {
    const token = this.extractToken(authorization);
    await this.authService.logout(token);
    return { success: true };
  }

  @Post("/refresh")
  async refresh(@Headers("authorization") authorization?: string) {
    const token = this.extractToken(authorization);
    return await this.authService.refresh(token);
  }

  private extractToken(authorization?: string): string {
    if (!authorization) {
      throw new BadRequestException("No authorization header");
    }
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer" || !token) {
      throw new BadRequestException("Invalid token format");
    }
    return token;
  }
}
