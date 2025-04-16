import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!process.env.MYSQL_PASSWORD) {
  console.error('MySQL password not found in environment variables!');
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'library',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;