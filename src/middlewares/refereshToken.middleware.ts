import { ForbiddenException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AwsCognitoService } from 'src/cognito/cognito.service';
// import { CurrentUser } from '../customDecorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly awsService: AwsCognitoService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User
    const accessToken = user.awsAccessToken
    const refreshToken = user.awsRefreshToken;

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'You are not authorized',
      });
    }

    // Check if the access token has expired
    const jwtParts = accessToken.split('.');
    const jwtPayload = JSON.parse(Buffer.from(jwtParts[1], 'base64').toString());
    const expTimestamp = jwtPayload.exp;
    const isExpired = expTimestamp > Date.now() / 1000;

    // Renew the session using the refresh token if the access token has expired
    if (isExpired) {
      try {
        const result = await this.awsService.initiateAuth(refreshToken);
        if (result) {
          // const newAccessToken = result.accessToken;
          // user.setMeta('aws_token', newAccessToken);
          user.awsAccessToken = result.accessToken
          // user.save()
        } else {
          // Handle the authentication failure
          return res.status(401).json({ error: 'Unauthorized' });
        }
      } catch (err) {
        return next(err);
      }
    }

    return next();
  }
}
