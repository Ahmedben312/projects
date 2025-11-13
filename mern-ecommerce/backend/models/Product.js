const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
