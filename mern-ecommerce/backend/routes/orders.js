const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/checkout', protect, async (req, res) => {
  try {
    const { items, total } = req.body;
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cart',
    });

    const order = new Order({ user: req.user._id, items, total });
    await order.save();

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  res.json({ received: true });
});

module.exports = router;
