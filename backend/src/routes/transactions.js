import express from 'express';
import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';
import { authMiddleware } from '../utils/middleware.js';

const router = express.Router();

// Borrow a book
router.post('/borrow/:bookId', authMiddleware, async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book || !book.available) return res.status(400).json({ message: 'Book not available' });
    book.available = false;
    book.borrowedBy = req.user.id;
    book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks
    await book.save();
    const transaction = new Transaction({ user: req.user.id, book: bookId });
    await transaction.save();
    res.json({ message: 'Book borrowed', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Return a book
router.post('/return/:bookId', authMiddleware, async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book || book.available) return res.status(400).json({ message: 'Book not borrowed' });
    if (book.borrowedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    book.available = true;
    book.borrowedBy = null;
    book.dueDate = null;
    await book.save();
    const transaction = await Transaction.findOne({ book: bookId, user: req.user.id, returnedAt: null });
    if (transaction) {
      transaction.returnedAt = new Date();
      await transaction.save();
    }
    res.json({ message: 'Book returned', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get transaction history (admin or user)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') query.user = req.user.id;
    const transactions = await Transaction.find(query).populate('book').populate('user');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
