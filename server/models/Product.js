import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  quantity: { type: Number },
  inStock: { type: Boolean, default: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  colors: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
