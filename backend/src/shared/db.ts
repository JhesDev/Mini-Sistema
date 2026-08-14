import { Sequelize } from 'sequelize';
import colors from 'colors';
import 'dotenv/config';

const {
  DB_NAME = 'gestion_tramites',
  DB_USER = 'root',
  DB_PASS = '',
  DB_HOST = 'localhost',
  DB_PORT = '3306',
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development'
    ? (sql: string) => console.log(colors.cyan(`[SQL] ${sql}`))
    : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30_000,
    idle: 10_000,
  },
  define: {
    // Las tablas ya existen; no modificar nombres por convención de Sequelize
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(
      colors.bgGreen.black.bold(` ✓ MySQL conectado: ${DB_HOST}:${DB_PORT}/${DB_NAME} `),
    );
  } catch (error) {
    console.error(colors.bgRed.white.bold(' ✗ Error al conectar a MySQL: '), error);
    process.exit(1);
  }
};