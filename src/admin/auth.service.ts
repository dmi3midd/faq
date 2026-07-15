import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminEntity } from "./entities/admin.entity";
import { AuthResponse } from "./dto/auth.response";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AdminDto } from "./dto/admin.dto";
import {
  AdminAlreadyExistsError,
  AdminNotFoundError,
  InvalidPasswordError,
  AdminInactiveError,
} from "../common/errors/auth/service.errors";


interface IAuthService {
  registration(username: string, email: string, password: string): Promise<AdminEntity>;
  login(username: string, password: string): Promise<AuthResponse>;
  logout(token: string): Promise<void>;
  refresh(token: string): Promise<AuthResponse>;
}

@Injectable()
export class AuthService implements IAuthService {

  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly jwtService: JwtService,
  ) {
  }

  async registration(username: string, email: string, password: string): Promise<AdminEntity> {
    const candidate = await this.adminRepository.findOne({ where: { email } });
    if (candidate) {
      throw new AdminAlreadyExistsError(email);
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    return await this.adminRepository.save({ username, email, password: hashedPassword, isActive: true });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new AdminNotFoundError(email);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new InvalidPasswordError();
    }

    if (!admin.isActive) {
      admin.isActive = true;
      await this.adminRepository.save(admin);
    }

    const adminDto = new AdminDto();
    adminDto.id = admin.id;
    adminDto.username = admin.username;
    adminDto.email = admin.email;
    
    const token = await this.jwtService.signAsync({ ...adminDto });
    const decoded = this.jwtService.decode(token) as { exp: number };
    const expiresAt = decoded.exp * 1000;

    return new AuthResponse(token, adminDto, expiresAt);
  }

  async logout(token: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(token, { ignoreExpiration: true }) as AdminDto;
    const candidate = await this.adminRepository.findOne({ where: { id: payload.id } });
    if (!candidate) {
      throw new AdminNotFoundError(payload.id);
    }
    await this.adminRepository.update({ id: candidate.id }, { isActive: false });
  }

  async refresh(token: string): Promise<AuthResponse> {
    const payload = await this.jwtService.verifyAsync(token, { ignoreExpiration: true }) as AdminDto;
    const candidate = await this.adminRepository.findOne({ where: { id: payload.id } });
    if (!candidate) {
      throw new AdminNotFoundError(payload.id);
    }
    if (!candidate.isActive) {
      throw new AdminInactiveError(candidate.email);
    }
    const adminDto = new AdminDto();
    adminDto.id = candidate.id;
    adminDto.username = candidate.username;
    adminDto.email = candidate.email;
    
    const newToken = await this.jwtService.signAsync({ ...adminDto });
    const decoded = this.jwtService.decode(newToken) as { exp: number };
    const expiresAt = decoded.exp * 1000;

    return new AuthResponse(newToken, adminDto, expiresAt);
  }
}
