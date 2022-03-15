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
import { Tokens } from './types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(id: number, email: string, password: string, role: Roles) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: id,
          email,
          password,
          role,
        },
        { expiresIn: 600, secret: this.config.get('AT_SECRET') },
      ),
      this.jwt.signAsync(
        {
          sub: id,
          email,
          password,
          role,
        },
        { expiresIn: 604800, secret: this.config.get('RT_SECRET') },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateRtHash(id: number, rt: string) {
    // const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        hashRt: rt,
      },
    });
  }

  async signup(dto: AuthDto): Promise<Tokens> {
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
      await this.updateRtHash(user.id, (await token).refreshToken);
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
  async signin(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('User Does Not Exist');
    const pwMatch = await argon.verify(user.hash, dto.password);
    if (!pwMatch) throw new ForbiddenException('Incorrect Credentials');
    const token = this.signToken(user.id, user.email, user.hash, user.role);
    await this.updateRtHash(user.id, (await token).refreshToken);
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

  async logout(id: number) {
    await this.prisma.user.updateMany({
      where: { id: id, hashRt: { not: null } },
      data: {
        hashRt: null,
      },
    });
    return 'User has logged out';
  }
  async refreshTokens(id: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new ForbiddenException('User does not exist');
    const rtMatch = rt.localeCompare(user.hashRt);
    if (rtMatch !== 0) throw new ForbiddenException('Access Denied');
    const token = this.signToken(user.id, user.email, user.hash, user.role);
    await this.updateRtHash(user.id, (await token).refreshToken);
    return token;
  }
}
