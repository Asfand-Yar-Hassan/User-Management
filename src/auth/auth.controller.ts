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
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { ResponseBody } from './bodies/response-body';
import { Public } from './decorators/public.decorator';
import { hasRoles } from './decorators/roles.decorator';
import { AuthDto, LoginDto, UpdateDto } from './dto';
import { HttpExceptionFilter } from './filters/http-exception.filters';
import { JwtGuard, RolesGuard } from './guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseFilters(HttpExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @Post('/local/signup')
  async signup(@Body() dto: AuthDto, @Res() res: Response): Promise<any> {
    const firstName = await this.authService.signup(dto, res);

    return res.send(new ResponseBody(true, { firstName: firstName }));
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
    return HttpStatus.OK;
  }
  @HttpCode(HttpStatus.OK)
  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return await this.authService.facebookLogin(req, res);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return HttpStatus.OK;
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return await this.authService.googleLogin(req, res);
  }

  @UseFilters(HttpExceptionFilter)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/local/signin')
  async signin(@Body() dto: LoginDto, @Res() res: Response): Promise<any> {
    const userEmail = await this.authService.signin(dto, res);
    return res.send(new ResponseBody(true, { email: userEmail }));
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
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
  async refreshTokens(@Req() request: Request, @Res() response: Response) {
    const user = request.user;
    const email = await this.authService.refreshTokens(
      user['sub'],
      user['refreshToken'],
      response,
    );
    response.send(new ResponseBody(true, { email: email }));
  }
}
