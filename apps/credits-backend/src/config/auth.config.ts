import { registerAs } from '@nestjs/config';

export interface AuthOptions {
  expiresIn: string;
  subscriptionExpiresIn: string;
  secret: string;
  username: string;
  password: string;
}

export default registerAs('auth', (): AuthOptions => {
  return {
    secret: process.env.JWT_SECRET || 'development_secret',
    expiresIn: process.env.JWT_EXPIRE_IN || '1d',
    subscriptionExpiresIn: process.env.JWT_SUBSCRIPTION_EXPIRE_IN || '1d',
    username: process.env.ADMIN_USERNAME || 'tendero_pueblo',
    password: process.env.ADMIN_PASSWORD || '12345',
  };
});