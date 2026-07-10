import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegistrationRequest } from "./dto/registration.request";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/")
  async registration(@Body() body: RegistrationRequest) {
    const adminId = await this.authService.registration(body.username, body.email, body.password);
    return { adminId };
  }
}
