import express from 'express';
import { Op } from 'sequelize';
import { Book } from '../models/index.js';
import { authMiddleware, adminMiddleware } from '../utils/middleware.js';

const router = express.Router();

// Get all books with search & filter
router.get('/', async (req, res) => {
  try {
    const { search, genre, author } = req.query;
    let where = {};
    
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (genre) {
      where.genre = genre;
    }
    if (author) {
      where.author = { [Op.like]: `%${author}%` };
    }

    const books = await Book.findAll({ where });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create book (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update book (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    await book.update(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete book (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    await book.destroy();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
