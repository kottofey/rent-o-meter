import { User, Role } from '@/models';

declare global {
  namespace Express {
    interface Request {
      user?: User & { roles: Role[] };
    }
  }
}

export {};
