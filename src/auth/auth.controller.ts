import { Controller, Post, Body, BadRequestException, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegistrationRequest } from "./dto/registration.request";
import { LoginRequest } from "./dto/login.request";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/registration")
  async registration(@Body() body: RegistrationRequest) {
    const admin = await this.authService.registration(body.username, body.email, body.password);
    return { adminId: admin.id };
  }

  @Post("/login")
  async login(
    @Body() body: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authData = await this.authService.login(body.email, body.password);

    res.cookie("refreshToken", authData.refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production if running HTTPS
      sameSite: "lax",
      path: "/",
    });

    res.setHeader("Authorization", `Bearer ${authData.accessToken}`);

    return { admin: authData.admin, accessToken: authData.accessToken };
  }

  @Post("/logout")
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new BadRequestException("No refresh token");
    }
    await this.authService.logout(token);
    res.clearCookie("refreshToken", { path: "/" });
    return { success: true };
  }

  @Post("/refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new BadRequestException("No refresh token");
    }
    const authData = await this.authService.refresh(token);

    res.cookie("refreshToken", authData.refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production if running HTTPS
      sameSite: "lax",
      path: "/",
    });

    res.setHeader("Authorization", `Bearer ${authData.accessToken}`);

    return { admin: authData.admin, accessToken: authData.accessToken };
  }
}
