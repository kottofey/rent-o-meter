import * as process from 'node:process';

const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = process.env;

const jwtConfig: {
  secret: string;
  expiresIn: number;
  refreshTokenExpiresIn: number;
} = {
  secret: JWT_SECRET ?? '',

  expiresIn: JWT_EXPIRES_IN ? parseInt(JWT_EXPIRES_IN) : 7 * 24 * 60 * 60, // по умолчанию 7 дней в секундах
  refreshTokenExpiresIn: JWT_REFRESH_EXPIRES_IN
    ? parseInt(JWT_REFRESH_EXPIRES_IN)
    : 30 * 24 * 60 * 60, // по умолчанию 30 дней в секундах
};

export default jwtConfig;
