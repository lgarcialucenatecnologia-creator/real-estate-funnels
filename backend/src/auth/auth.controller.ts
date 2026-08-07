import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // Protege una clave reusable (no un envío de una sola vez): 5 intentos/15min.
  @Throttle({ default: { limit: 5, ttl: 900_000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.password);
  }
}
