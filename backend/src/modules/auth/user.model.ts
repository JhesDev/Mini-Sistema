import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/shared/db';
import { UserRole } from './auth.schema';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  nombre_completo: string;
  rol: UserRole;
  activo: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'activo' | 'rol'>;

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare nombre_completo: string;
  declare rol: UserRole;
  declare activo: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  /** Retorna el usuario serializado sin la contraseña */
  toSafeJSON() {
    const values = { ...this.get() };
    delete (values as Record<string, unknown>).password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nombre_completo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('ADMIN', 'OPERADOR', 'SUPERVISOR'),
      allowNull: false,
      defaultValue: 'OPERADOR',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);
