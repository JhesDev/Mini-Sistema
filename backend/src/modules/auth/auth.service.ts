import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from './user.model';
import { LoginDto, AuthUserPayload } from './auth.schema';
import { UnauthorizedError } from '@/shared/error.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'mini_sistema_jwt_secret_key_2026_super_secure';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '8h') as string;

export const authService = {
  login: async (dto: LoginDto) => {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: dto.username }, { email: dto.username }],
      },
    });

    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    if (!user.activo) {
      throw new UnauthorizedError('Usuario inactivo. Comuníquese con el administrador.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const payload: AuthUserPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      nombre_completo: user.nombre_completo,
      rol: user.rol,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as SignOptions);

    return {
      token,
      user: user.toSafeJSON(),
    };
  },

  getProfile: async (userId: number) => {
    const user = await User.findByPk(userId);
    if (!user || !user.activo) {
      throw new UnauthorizedError('Usuario no encontrado o inactivo');
    }
    return user.toSafeJSON();
  },
};
