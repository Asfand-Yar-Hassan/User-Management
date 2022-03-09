import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
})
export class AuthModule {}
