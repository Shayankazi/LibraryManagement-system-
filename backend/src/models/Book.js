import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  rent: { type: Number, required: true },
  genre: { type: String },
  description: { type: String },
  coverImage: { type: String },
  available: { type: Boolean, default: true },
  borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  dueDate: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
