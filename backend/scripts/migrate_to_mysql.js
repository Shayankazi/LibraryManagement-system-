import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import sequelize from '../src/config/database.js';
import { Book, User, Rental, Transaction, Donation } from '../src/models/index.js';

dotenv.config();

const migrateData = async () => {
  try {
    // Connect to MongoDB
    const mongoClient = await MongoClient.connect(process.env.MONGODB_URI);
    const db = mongoClient.db();

    // Connect to MySQL through Sequelize
    await sequelize.authenticate();
    console.log('Connected to both databases');

    // Sync MySQL database with force:true to start fresh
    await sequelize.sync({ force: true });
    console.log('MySQL tables created');

    // Migrate Users
    const users = await db.collection('users').find({}).toArray();
    await User.bulkCreate(users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role
    })));
    console.log('Users migrated');

    // Migrate Books
    const books = await db.collection('books').find({}).toArray();
    await Book.bulkCreate(books.map(book => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      rent: book.rent,
      genre: book.genre,
      description: book.description,
      coverImage: book.coverImage,
      available: book.available,
      borrowedById: book.borrowedBy?.toString(),
      dueDate: book.dueDate
    })));
    console.log('Books migrated');

    // Migrate Rentals
    const rentals = await db.collection('rentals').find({}).toArray();
    await Rental.bulkCreate(rentals.map(rental => ({
      id: rental._id.toString(),
      bookId: rental.book?.toString(),
      userId: rental.user?.toString(),
      startDate: rental.startDate,
      endDate: rental.endDate,
      totalRent: rental.totalRent,
      extraCharge: rental.extraCharge
    })));
    console.log('Rentals migrated');

    // Migrate Transactions
    const transactions = await db.collection('transactions').find({}).toArray();
    await Transaction.bulkCreate(transactions.map(transaction => ({
      id: transaction._id.toString(),
      userId: transaction.user?.toString(),
      bookId: transaction.book?.toString(),
      borrowedAt: transaction.borrowedAt,
      returnedAt: transaction.returnedAt
    })));
    console.log('Transactions migrated');

    // Migrate Donations
    const donations = await db.collection('donations').find({}).toArray();
    await Donation.bulkCreate(donations.map(donation => ({
      id: donation._id.toString(),
      name: donation.name,
      publishingYear: donation.publishingYear,
      quantity: donation.quantity,
      condition: donation.condition,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      donorPhone: donation.donorPhone,
      donorAddress: donation.donorAddress
    })));
    console.log('Donations migrated');

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData();