import express from 'express';
import { Donation } from '../models/index.js';

const router = express.Router();

// POST /api/donate
router.post('/', async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json({ 
      message: 'Donation received', 
      donation 
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'Failed to save donation', 
      error: err.message 
    });
  }
});

// GET /api/donate - list all donations (admin only)
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
