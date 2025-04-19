import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  shopName: String,
  bio: String,
  createdAt: { type: Date, default: Date.now }
});

export const Seller =  mongoose.model('Seller', sellerSchema);
