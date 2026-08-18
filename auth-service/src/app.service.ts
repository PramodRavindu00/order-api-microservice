import { ConflictException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from './config/prisma/prisma.service';
import { passwordHash } from './utils/bcrypt-util';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(dto: SignupDto) {
    const existByEmail = await this.prisma.account.findUnique({
      where: { email: dto.email },
    });

    if (existByEmail) {
      throw new ConflictException('User already registered');
    }

    const hashedPassword = await passwordHash(dto.password);
    const newUser = await this.prisma.account.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
      },
    });
  }

  async login() {}
  async logOut() {}
  async revokeToken() {}
}
