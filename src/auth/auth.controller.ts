// eslint-disable-next-line prettier/prettier
import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UpdateDto } from 'src/auth/updatedto';

import { AuthService } from './auth.service';
import { hasRoles } from './decorators/roles.decorator';
import { AuthDto } from './dto';
import { JwtGuard } from './guard/jwt.guard';
import { RolesGuard } from './guard/roles.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signup(@Body() dto: AuthDto) {
    return await this.authService.signup(dto);
  }

  @Post('/signin')
  async signin(@Body() dto: AuthDto) {
    return await this.authService.signin(dto);
  }
  @hasRoles('ADMIN')
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('/deletebyemail')
  async delete(@Query('email') email: string, @Req() request: Request) {
    return await this.authService.delete(email, request);
  }

  @UseGuards(JwtGuard)
  @Get('/getuserbyemail')
  async getUser(@Query('email') email: string, @Req() request: Request) {
    return await this.authService.getUser(email, request);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get('/getallusers')
  async getAll() {
    return await this.authService.getAll();
  }

  @UseGuards(JwtGuard)
  @Put('/updateuser')
  async updateUser(
    @Query('email') email: string,
    @Req() request: Request,
    @Body() dto: UpdateDto,
  ) {
    return await this.authService.updateUser(email, request, dto);
  }
}
