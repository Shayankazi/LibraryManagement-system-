import express from 'express';
import sequelize from '../config/database.js';
import { Transaction, Book, User } from '../models/index.js';
import { authMiddleware } from '../utils/middleware.js';

const router = express.Router();

// Borrow a book
router.post('/borrow/:bookId', authMiddleware, async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { bookId } = req.params;
    const book = await Book.findByPk(bookId, { 
      lock: true,
      transaction: t 
    });

    if (!book || !book.available) {
      await t.rollback();
      return res.status(400).json({ message: 'Book not available' });
    }

    // Update book status
    await book.update({
      available: false,
      borrowedById: req.user.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks
    }, { transaction: t });

    // Create transaction record
    const transaction = await Transaction.create({
      userId: req.user.id,
      bookId: bookId,
      borrowedAt: new Date()
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'Book borrowed', book });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
});

// Return a book
router.post('/return/:bookId', authMiddleware, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { bookId } = req.params;
    const book = await Book.findByPk(bookId, {
      lock: true,
      transaction: t
    });

    if (!book || book.available) {
      await t.rollback();
      return res.status(400).json({ message: 'Book not borrowed' });
    }

    if (book.borrowedById !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update book status
    await book.update({
      available: true,
      borrowedById: null,
      dueDate: null
    }, { transaction: t });

    // Update transaction record
    await Transaction.update(
      { returnedAt: new Date() },
      { 
        where: { 
          bookId: bookId,
          userId: req.user.id,
          returnedAt: null
        },
        transaction: t
      }
    );

    await t.commit();
    res.json({ message: 'Book returned', book });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
});

// Get transaction history (admin or user)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let where = {};
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const transactions = await Transaction.findAll({
      where,
      include: [
        {
          model: Book,
          attributes: ['id', 'title', 'author', 'coverImage']
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['borrowedAt', 'DESC']]
    });
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
