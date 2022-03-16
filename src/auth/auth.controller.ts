// eslint-disable-next-line prettier/prettier
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { ResponseBody } from './bodies/response-body';
import { Public } from './decorators/public.decorator';
import { hasRoles } from './decorators/roles.decorator';
import { AuthDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import { HttpExceptionFilter } from './filters/http-exception.filters';
import { JwtGuard, RolesGuard } from './guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @Post('/local/signup')
  async signup(@Body() dto: AuthDto): Promise<any> {
    const apiResponse = await this.authService.signup(dto);
    return new ResponseBody(true, apiResponse);
  }

  @UseFilters(HttpExceptionFilter)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/local/signin')
  async signin(@Body() dto: LoginDto): Promise<any> {
    const apiResponse = await this.authService.signin(dto);
    return new ResponseBody(true, apiResponse);
  }

  @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post('/local/logout')
  async logout(@Req() req: Request) {
    const user = req.user;
    const apiResponse = await this.authService.logout(user['sub']);
    return new ResponseBody(true, apiResponse);
  }

  // @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @hasRoles('ADMIN')
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('/deletebyemail')
  async delete(@Query('email') email: string, @Req() request: Request) {
    const apiResponse = await this.authService.delete(email, request);
    return new ResponseBody(true, apiResponse);
  }

  @UseFilters(HttpExceptionFilter)
  @UseGuards(JwtGuard)
  @Get('/getuserbyemail')
  async getUser(@Query('email') email: string, @Req() request: Request) {
    const apiResponse = await this.authService.getUser(email, request);
    return new ResponseBody(true, apiResponse);
  }

  @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.FOUND)
  @Get('/getallusers')
  async getAll() {
    const apiResponse = await this.authService.getAll();
    return new ResponseBody(true, apiResponse);
  }

  @UseFilters(HttpExceptionFilter)
  @hasRoles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard, RolesGuard)
  @Put('/updateuser')
  async updateUser(
    @Query('email') email: string,
    @Req() request: Request,
    @Body() dto: UpdateDto,
  ) {
    const apiResponse = await this.authService.updateUser(email, request, dto);
    return new ResponseBody(true, apiResponse);
  }

  @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  async refreshTokens(@Req() request: Request) {
    const user = request.user;
    const apiResponse = await this.authService.refreshTokens(
      user['sub'],
      user['refreshToken'],
    );
    return new ResponseBody(true, apiResponse);
  }
}
