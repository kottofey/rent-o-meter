import jwt from 'jsonwebtoken';

import { User } from '@/models';
import { jwtConfig } from '@/config';

interface IUserPayload {
  id: number;
  fio: string;
  email: string;
  roles: string[];
}

export default function generateTokens(userPayload: User) {
  const payload: IUserPayload = {
    id: userPayload.id,
    fio: userPayload.full_name,
    email: userPayload.email,
    roles: userPayload.roles.map(r => r.name),
  };

  console.log('generateTokens: генерируем токены');

  const accessToken = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  const refreshToken = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshTokenExpiresIn,
  });

  console.log('generateTokens: токены готовы');

  return { accessToken, refreshToken };
}
