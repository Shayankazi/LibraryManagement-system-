import express from 'express';
import sequelize from '../config/database.js';
import { Book, Rental } from '../models/index.js';
import { authMiddleware } from '../utils/middleware.js';

const router = express.Router();

// POST /api/rent/checkout
router.post('/checkout', authMiddleware, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { rentals, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(rentals) || rentals.length === 0) {
      return res.status(400).json({ message: 'No rentals provided' });
    }

    const results = [];
    for (const item of rentals) {
      const { id: bookId, startDate, endDate, totalRent, extraCharge } = item;
      
      // Find and lock the book for update
      const book = await Book.findByPk(bookId, { 
        lock: true,
        transaction: t 
      });

      if (!book) {
        results.push({ bookId, status: 'failed', reason: 'Book not found' });
        continue;
      }

      if (!book.available) {
        results.push({ bookId, status: 'failed', reason: 'Book not available' });
        continue;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        results.push({ bookId, status: 'failed', reason: 'Invalid date range' });
        continue;
      }

      // Create Rental
      const rental = await Rental.create({
        bookId: book.id,
        userId,
        startDate: start,
        endDate: end,
        totalRent,
        extraCharge: extraCharge || 0
      }, { transaction: t });

      // Update book status
      await book.update({
        available: false,
        borrowedById: userId,
        dueDate: end
      }, { transaction: t });

      results.push({ 
        bookId, 
        status: 'success', 
        rentalId: rental.id 
      });
    }

    // If we got here, no errors occurred
    await t.commit();

    // Find a successful rentalId to use as the orderId
    const firstSuccess = results.find(r => r.status === 'success');
    const orderId = firstSuccess ? firstSuccess.rentalId : null;
    
    res.json({ 
      message: 'Checkout processed', 
      orderId, 
      results 
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

export default router;
