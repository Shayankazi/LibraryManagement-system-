import express from 'express';
console.log('[rental.js] Rental route loaded');
import Rental from '../models/Rental.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { authMiddleware } from '../utils/middleware.js';
const router = express.Router();

// POST /api/rent/checkout
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { rentals, paymentMethod } = req.body;
    const userId = req.user.id;
    if (!Array.isArray(rentals) || rentals.length === 0) {
      return res.status(400).json({ message: 'No rentals provided' });
    }
    const results = [];
    for (const item of rentals) {
      const { id: bookId, startDate, endDate, totalRent, extraCharge } = item;
      const book = await Book.findById(bookId);
      if (!book) {
        results.push({ bookId, status: 'failed', reason: 'Book not found' });
        continue;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        results.push({ bookId, status: 'failed', reason: 'Invalid date range' });
        continue;
      }

      // Create Rental
      const rental = new Rental({
        book: book._id,
        user: userId,
        startDate: start,
        endDate: end,
        totalRent,
        extraCharge: extraCharge || 0
      });
      await rental.save();

      // Update book status for all payment methods
      book.available = false;
      book.borrowedBy = userId;
      book.dueDate = end;
      await book.save();

      results.push({ bookId, status: 'success', rentalId: rental._id });
    }
    // Find a successful rentalId to use as the orderId
    const firstSuccess = results.find(r => r.status === 'success');
    const orderId = firstSuccess ? firstSuccess.rentalId : null;
    res.json({ message: 'Checkout processed', orderId, results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
