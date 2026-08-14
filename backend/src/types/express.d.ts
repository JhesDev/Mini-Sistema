import { AuthUserPayload } from '../modules/auth/auth.schema';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}
