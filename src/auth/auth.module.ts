import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './guard';
import { AtStrategy, GoogleStrategy, RtStrategy } from './strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';

@Module({
  providers: [
    AuthService,
    RtStrategy,
    AtStrategy,
    RolesGuard,
    GoogleStrategy,
    FacebookStrategy,
  ],
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
})
export class AuthModule {}
