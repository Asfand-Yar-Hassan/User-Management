import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtDecode {
  static retriveUserEmailFromAccessToken(
    jwt: JwtService,
    accessToken: string,
  ): string {
    const decodedAccesstoken = jwt.decode(accessToken) as {
      [key: string]: any;
    };
    return decodedAccesstoken.email;
  }
  static retriveUserIdFromAccessToken(
    jwt: JwtService,
    accessToken: string,
  ): string {
    const decodedAccesstoken = jwt.decode(accessToken) as {
      [key: string]: any;
    };
    return decodedAccesstoken.sub;
  }
}
