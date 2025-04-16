import express from 'express';
import { Op } from 'sequelize';
import { Rental, Book, User } from '../models/index.js';
import { authMiddleware } from '../utils/middleware.js';

const router = express.Router();

// GET /api/rentals - Get all rentals for current user (or all if admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let where = {};
    if (req.user && req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const rentals = await Rental.findAll({
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
      order: [['createdAt', 'DESC']]
    });

    console.log('Rentals found:', rentals.length);
    res.json(rentals);
  } catch (err) {
    console.error('Error fetching rentals:', err);
    res.status(500).json({ 
      message: 'Failed to fetch rentals', 
      error: err.message 
    });
  }
});

export default router;
