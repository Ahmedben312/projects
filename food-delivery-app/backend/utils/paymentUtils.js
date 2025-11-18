const { PAYMENT_CONFIG } = require("../config/payment");

const calculateOrderTotals = (subtotal, deliveryFee, taxRate, tip = 0) => {
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax + tip;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    tip: parseFloat(tip.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

const validatePaymentAmount = (amount, currency = "usd") => {
  if (amount <= 0) {
    return { valid: false, error: "Amount must be greater than 0" };
  }

  if (!PAYMENT_CONFIG.currencies.supported.includes(currency.toLowerCase())) {
    return { valid: false, error: `Currency ${currency} is not supported` };
  }

  // Minimum amount validation (Stripe requires at least $0.50 for USD)
  const minAmount = currency.toLowerCase() === "usd" ? 0.5 : 0.5;
  if (amount < minAmount) {
    return {
      valid: false,
      error: `Amount must be at least ${minAmount} ${currency.toUpperCase()}`,
    };
  }

  return { valid: true };
};

const formatAmountForStripe = (amount, currency = "usd") => {
  // Stripe amounts are in cents/pence
  const zeroDecimalCurrencies = [
    "bif",
    "clp",
    "djf",
    "gnf",
    "jpy",
    "kmf",
    "krw",
    "mga",
    "pyg",
    "rwf",
    "ugx",
    "vnd",
    "vuv",
    "xaf",
    "xof",
    "xpf",
  ];

  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return Math.round(amount);
  }

  return Math.round(amount * 100);
};

const generatePaymentDescription = (orderNumber, restaurantName) => {
  return `Food delivery order ${orderNumber} from ${restaurantName}`;
};

const handlePaymentError = (error) => {
  console.error("Payment error:", error);

  switch (error.type) {
    case "StripeCardError":
      return {
        success: false,
        message: "Your card was declined. Please try a different card.",
        code: "card_declined",
      };
    case "StripeRateLimitError":
      return {
        success: false,
        message: "Too many requests. Please try again later.",
        code: "rate_limit",
      };
    case "StripeInvalidRequestError":
      return {
        success: false,
        message: "Invalid parameters were supplied to Stripe API.",
        code: "invalid_request",
      };
    case "StripeAPIError":
      return {
        success: false,
        message: "An error occurred with Stripe API. Please try again.",
        code: "api_error",
      };
    case "StripeConnectionError":
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
        code: "connection_error",
      };
    case "StripeAuthenticationError":
      return {
        success: false,
        message: "Authentication error. Please contact support.",
        code: "authentication_error",
      };
    default:
      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        code: "unknown_error",
      };
  }
};

module.exports = {
  calculateOrderTotals,
  validatePaymentAmount,
  formatAmountForStripe,
  generatePaymentDescription,
  handlePaymentError,
};
