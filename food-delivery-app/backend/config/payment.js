const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PAYMENT_CONFIG = {
  currencies: {
    default: "usd",
    supported: ["usd", "eur"],
  },
  deliveryFee: 2.99,
  taxRate: 0.08,
  minOrderAmount: 5.0,
};

module.exports = { stripe, PAYMENT_CONFIG };
