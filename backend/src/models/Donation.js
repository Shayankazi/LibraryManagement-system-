import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  publishingYear: { type: String, required: true },
  quantity: { type: Number, required: true },
  condition: { type: String, required: true },
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  donorPhone: { type: String, required: true },
  donorAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Donation', donationSchema);
