import 'dotenv/config';
import colors from 'colors';
import app from './app';
import { connectDB } from '@/shared/db';

const PORT = Number(process.env.PORT ?? 3000);

const start = async () => {
  // 1. Conectar base de datos
  await connectDB();

  // 2. Levantar servidor HTTP
  const server = app.listen(PORT, () => {
    console.log(
      colors.bgBlue.white.bold(` 🚀 Servidor corriendo en http://localhost:${PORT} `),
    );
    console.log(
      colors.cyan(`    → Health: http://localhost:${PORT}/api/health`),
    );
  });

  // 3. Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(colors.yellow(`\n[${signal}] Cerrando servidor...`));
    server.close(() => {
      console.log(colors.yellow('Servidor cerrado correctamente.'));
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start().catch((err) => {
  console.error(colors.red('Error fatal al iniciar el servidor:'), err);
  process.exit(1);
});
