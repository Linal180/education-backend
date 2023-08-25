import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  private apiKeys: string[];
  constructor(private readonly configService: ConfigService) {
    this.apiKeys = [...this.configService.get<string>('aws.allowedAPIKeys').split(',')];
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { apikey } = req.headers;
    if (!apikey || !(this.apiKeys.find(key => key === apikey))) {
      // Handle the authentication failure
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // If the API key matches, continue to the next middleware or route
    next();
  }
}