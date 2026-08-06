import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get<string>('adminApiKey');
    if (!expected) {
      throw new UnauthorizedException('ADMIN_API_KEY no está configurada');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.header('x-api-key');
    if (provided !== expected) {
      throw new UnauthorizedException('API key inválida');
    }

    return true;
  }
}
