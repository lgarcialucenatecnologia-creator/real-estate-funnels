import { timingSafeEqual } from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async login(password: string): Promise<{ token: string }> {
    const expected = this.config.get<string>('adminPassword');
    if (!expected) {
      throw new UnauthorizedException('ADMIN_PASSWORD no está configurada');
    }

    if (!this.matchesPassword(password, expected)) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    const token = await this.jwt.signAsync({ role: 'admin' });
    return { token };
  }

  /**
   * Comparación en tiempo constante. `timingSafeEqual` lanza si los buffers
   * difieren en longitud, así que hay que descartar ese caso antes de
   * llamarlo — de lo contrario una contraseña de largo distinto rompería el
   * login con un 500 en vez de un 401 normal.
   */
  private matchesPassword(received: string, expected: string): boolean {
    const receivedBuffer = Buffer.from(received);
    const expectedBuffer = Buffer.from(expected);

    if (receivedBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(receivedBuffer, expectedBuffer);
  }
}
