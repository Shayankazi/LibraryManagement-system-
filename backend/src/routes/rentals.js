import express from 'express';
import mongoose from 'mongoose';
import Rental from '../models/Rental.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { authMiddleware } from '../utils/middleware.js';

const router = express.Router();

// GET /api/rentals - Get all rentals for current user (or all if admin)
router.get('/', authMiddleware, async (req, res) => {
  console.log('Rentals requested by:', req.user);
  try {
    let query = {};
    if (req.user.role !== 'admin') query.user = new mongoose.Types.ObjectId(req.user.id);
    const rentals = await Rental.find(query)
      .populate('book')
      .populate('user')
      .sort({ createdAt: -1 });
    console.log('Rentals found:', rentals); // Debug log
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
