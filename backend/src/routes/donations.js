import express from 'express';
import Donation from '../models/Donation.js';

const router = express.Router();

// POST /api/donate
router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json({ message: 'Donation received', donation });
  } catch (err) {
    res.status(400).json({ message: 'Failed to save donation', error: err.message });
  }
});

// (Optional) GET /api/donate - list all donations (admin only)
// router.get('/', async (req, res) => {
//   const donations = await Donation.find().sort({ createdAt: -1 });
//   res.json(donations);
// });

export default router;
