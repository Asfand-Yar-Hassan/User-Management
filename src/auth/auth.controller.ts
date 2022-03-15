// eslint-disable-next-line prettier/prettier
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateDto } from 'src/auth/updatedto';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { hasRoles } from './decorators/roles.decorator';
import { AuthDto } from './dto';
import { JwtGuard } from './guard/jwt.guard';
import { RolesGuard } from './guard/roles.guard';
import { Tokens } from './types';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/local/signup')
  async signup(@Body() dto: AuthDto): Promise<Tokens> {
    return await this.authService.signup(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/local/signin')
  async signin(@Body() dto: AuthDto): Promise<Tokens> {
    return await this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post('/local/logout')
  async logout(@Req() req: Request) {
    const user = req.user;
    await this.authService.logout(user['sub']);
    return `User has logged out`;
  }

  @HttpCode(HttpStatus.OK)
  @hasRoles('ADMIN')
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('/deletebyemail')
  async delete(@Query('email') email: string, @Req() request: Request) {
    return await this.authService.delete(email, request);
  }

  @HttpCode(HttpStatus.FOUND)
  @hasRoles('ADMIN')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/getuserbyemail')
  async getUser(@Query('email') email: string, @Req() request: Request) {
    return await this.authService.getUser(email, request);
  }

  @HttpCode(HttpStatus.FOUND)
  @UseGuards(JwtGuard)
  @Get('/getallusers')
  async getAll() {
    return await this.authService.getAll();
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Put('/updateuser')
  async updateUser(
    @Query('email') email: string,
    @Req() request: Request,
    @Body() dto: UpdateDto,
  ) {
    return await this.authService.updateUser(email, request, dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  async refreshTokens(@Req() request: Request) {
    const user = request.user;
    return await this.authService.refreshTokens(
      user['sub'],
      user['refreshToken'],
    );
  }
}
