import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminEntity } from "./entities/admin.entity";

interface IAuthService {
  registration(username: string, email: string, password: string): Promise<string>;
}

@Injectable()
export class AuthService implements IAuthService {

  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {
  }

  async registration(username: string, email: string, password: string): Promise<string> {
    const newAdmin = this.adminRepository.create({ username, email, password });
    await this.adminRepository.save(newAdmin);
    return newAdmin.id;
  }
}
