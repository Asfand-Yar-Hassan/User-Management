import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { Request } from 'express';
import { UpdateDto } from 'src/auth/updatedto';
import { PrismaService } from 'src/prisma/prisma.service';

import { JwtDecode } from './decode';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(
    id: number,
    email: string,
    password: string,
    role: Roles,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: id,
      email,
      password,
      role,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret: secret,
    });
    return { access_token: token };
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          hash: hash,
          role: dto.role,
        },
      });

      const token = this.signToken(user.id, user.email, user.hash, user.role);
      return token;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('User Does Not Exist');
    const pwMatch = await argon.verify(user.hash, dto.password);
    if (!pwMatch) throw new ForbiddenException('Incorrect Credentials');
    const token = this.signToken(user.id, user.email, user.hash, user.role);
    return token;
  }

  async delete(email: string, request: Request) {
    const authHeader = request.get('Authorization');
    const accessToken = authHeader.slice(7);
    const accessEmail = await JwtDecode.retriveUserEmailFromAccessToken(
      this.jwt,
      accessToken,
    );
    if (email === accessEmail) {
      return 'Cannot delete user';
    }
    const user = await this.prisma.user.delete({
      where: { email: email },
    });
    return `${user.firstName} deleted`;
  }

  async getUser(email: string, request: Request) {
    const authHeader = request.get('Authorization');
    const accessToken = authHeader.slice(7);
    const accessEmail = await JwtDecode.retriveUserEmailFromAccessToken(
      this.jwt,
      accessToken,
    );
    const user = await this.prisma.user.findUnique({
      where: { email: accessEmail },
    });
    return user;
  }
  async getAll() {
    const user = await this.prisma.user.findMany();
    return user;
  }
  async updateUser(email: string, request: Request, dto: UpdateDto) {
    const authHeader = request.get('Authorization');
    const accessToken = authHeader.slice(7);
    const accessEmail = await JwtDecode.retriveUserEmailFromAccessToken(
      this.jwt,
      accessToken,
    );
    const user = await this.prisma.user.update({
      where: { email: accessEmail },
      data: { firstName: dto.firstName },
    });
    return user;
  }
}
