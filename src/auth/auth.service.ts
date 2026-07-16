import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminEntity } from "./entities/admin.entity";
import { AuthResponse } from "./dto/auth.response";
import { ConfigService } from "@nestjs/config";
import {
  AdminAlreadyExistsError,
  AdminNotFoundError,
  InvalidPasswordError,
} from "../common/errors/auth/service.errors";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { AxiosError } from "axios";
import { AdminDto } from "./dto/admin.dto";

interface MacauthUserDto {
  userId: string;
  username: string;
  email: string;
}

interface MacauthAuthResponse {
  user: MacauthUserDto;
  accessToken: string;
  refreshToken: string;
}

interface IAuthService {
  registration(username: string, email: string, password: string): Promise<AdminEntity>;
  login(username: string, password: string): Promise<AuthResponse>;
  logout(token: string): Promise<void>;
  refresh(token: string): Promise<AuthResponse>;
}

@Injectable()
export class AuthService implements IAuthService {

  private readonly authUrl: string;

  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.authUrl = this.configService.get<string>("AUTH_SERVICE_URL") as string;
  }

  // TODO: review and create better error handlig
  private handleAxiosError(error: any, emailOrIdentifier?: string): never {
    if (error instanceof AxiosError || (error && error.isAxiosError)) {
      const axiosError = error as AxiosError<{ code: number; message: string }>;
      const status = axiosError.response?.status;
      const responseData = axiosError.response?.data;

      if (status === 409) {
        throw new AdminAlreadyExistsError(emailOrIdentifier || '');
      }
      if (status === 404) {
        throw new AdminNotFoundError(emailOrIdentifier || '');
      }
      if (status === 400 && responseData?.message === 'Invalid password') {
        throw new InvalidPasswordError();
      }
    }
    throw error;
  }

  async registration(username: string, email: string, password: string): Promise<AdminEntity> {
    try {
      const resp = await firstValueFrom(
        this.httpService.post<{ user: MacauthUserDto }>(
          `${this.authUrl}/macauth/auth/registration`,
          { username, email, password },
        )
      );
      const admin = this.adminRepository.create(resp.data.user);
      return await this.adminRepository.save(admin);
    } catch (error) {
      this.handleAxiosError(error, email);
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const resp = await firstValueFrom(
        this.httpService.post<MacauthAuthResponse>(
          `${this.authUrl}/macauth/auth/login`,
          { email, password },
        )
      );
      const { user, accessToken, refreshToken } = resp.data;
      const admin = new AdminDto()
      admin.id = user.userId;
      admin.username = user.username;
      admin.email = user.email;
      return new AuthResponse(
        admin,
        refreshToken,
        accessToken,
      );
    } catch (error) {
      this.handleAxiosError(error, email);
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.authUrl}/macauth/auth/logout`,
          { data: { refreshToken: token } }
        )
      );
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async refresh(token: string): Promise<AuthResponse> {
    try {
      const resp = await firstValueFrom(
        this.httpService.put<MacauthAuthResponse>(
          `${this.authUrl}/macauth/auth/refresh`,
          { refreshToken: token },
        )
      );
      const { user, accessToken, refreshToken } = resp.data;
      const admin = new AdminDto()
      admin.id = user.userId;
      admin.username = user.username;
      admin.email = user.email;
      return new AuthResponse(
        admin,
        refreshToken,
        accessToken,
      );
    } catch (error) {
      this.handleAxiosError(error);
    }
  }
}
