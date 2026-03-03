import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  heroImage: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);
