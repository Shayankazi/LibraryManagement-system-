import express from 'express';
import Book from '../models/Book.js';
import { authMiddleware, adminMiddleware } from '../utils/middleware.js';

const router = express.Router();

// Get all books with search & filter
router.get('/', async (req, res) => {
  try {
    const { search, genre, author } = req.query;
    let query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (genre) query.genre = genre;
    if (author) query.author = { $regex: author, $options: 'i' };
    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create book (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update book (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete book (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
