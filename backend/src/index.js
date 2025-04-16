import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import userRoutes from './routes/users.js';
import transactionRoutes from './routes/transactions.js';
import rentalRoutes from './routes/rental.js';
import rentalsRoutes from './routes/rentals.js';
import donationRoutes from './routes/donations.js';

// Import models to ensure they are registered
import './models/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rent', rentalRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/donate', donationRoutes);

const PORT = process.env.PORT || 5001;

// Sync database and start server
sequelize.sync({ alter: true }) // Use alter: true during development, force: true to recreate tables
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
