/* eslint-disable @typescript-eslint/no-unsafe-return */
import { JwtService } from '@nestjs/jwt';

import { JwtConfig } from 'common';

export async function getTokens(user_id: string, email: string, role: string) {
  const jwt = new JwtService();
  const payload = {
    user_id,
    email,
    role,
  };

  const [accessToken, refreshToken] = await Promise.all([
    jwt.signAsync(payload, {
      secret: JwtConfig.JWT_ACCESS_SECRET,
    }),
    jwt.signAsync(payload, {
      secret: JwtConfig.JWT_REFRESH_SECRET,
    }),
  ]);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

export function decodeRefreshToken(token: string) {
  const jwt = new JwtService();

  return jwt.decode(token);
}
