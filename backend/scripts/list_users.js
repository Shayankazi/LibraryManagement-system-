import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from '../src/models/User.js';

async function listUsers() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const users = await User.find();
  users.forEach(u => {
    console.log(`User: ${u.name || u.username || u.email} | ID: ${u._id} | Role: ${u.role}`);
  });
  mongoose.disconnect();
}

listUsers();
