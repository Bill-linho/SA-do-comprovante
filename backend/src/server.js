import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { sequelize } from './config/database.js';
import { User, DiningTable } from './models/index.js';
import bcrypt from 'bcrypt';

const port = Number(process.env.PORT || 3000);
try {
  await sequelize.authenticate();
  console.log('PostgreSQL conectado.');
  if (process.env.NODE_ENV !== 'production') await sequelize.sync({ alter: true });
  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const exists = await User.findOne({ where: { email: process.env.SEED_ADMIN_EMAIL } });
    if (!exists) {
      await User.create({
        name: process.env.SEED_ADMIN_NAME || 'Administrador',
        email: process.env.SEED_ADMIN_EMAIL,
        passwordHash: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12),
        role: 'ADMIN'
      });
      console.log('Administrador inicial criado.');
    }
  }
  if (await DiningTable.count() === 0) {
    await DiningTable.bulkCreate([{number:1,capacity:2},{number:2,capacity:4},{number:3,capacity:4},{number:4,capacity:6}]);
  }
  app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
} catch (error) {
  console.error('Falha ao iniciar:', error);
  process.exit(1);
}
