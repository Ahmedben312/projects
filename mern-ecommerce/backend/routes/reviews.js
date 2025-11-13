const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const review = new Review({ product, user: req.user._id, rating, comment });
    await review.save();

    await Product.findByIdAndUpdate(product, { $push: { reviews: review._id } });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
