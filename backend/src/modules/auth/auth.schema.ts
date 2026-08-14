import { z } from 'zod';

export const UserRoleEnum = z.enum(['ADMIN', 'OPERADOR', 'SUPERVISOR']);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const loginSchema = z.object({
  username: z.string().min(1, 'El usuario o correo es obligatorio').trim(),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthUserPayload {
  id: number;
  username: string;
  email: string;
  nombre_completo: string;
  rol: UserRole;
}

