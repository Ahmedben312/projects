const { stripe, PAYMENT_CONFIG } = require("../config/payment");

class PaymentService {
  async createPaymentIntent(amount, currency = "usd", metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error("Payment intent creation error:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status === "succeeded") {
        return {
          success: true,
          paymentIntent: paymentIntent,
        };
      }

      return {
        success: false,
        status: paymentIntent.status,
        error: paymentIntent.last_payment_error,
      };
    } catch (error) {
      console.error("Payment confirmation error:", error);
      throw new Error("Failed to confirm payment");
    }
  }

  async createCustomer(email, name, phone) {
    try {
      const customer = await stripe.customers.create({
        email: email,
        name: name,
        phone: phone,
      });

      return customer;
    } catch (error) {
      console.error("Customer creation error:", error);
      throw new Error("Failed to create customer");
    }
  }

  async refundPayment(paymentIntentId, amount = null) {
    try {
      const refundParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundParams);

      return refund;
    } catch (error) {
      console.error("Refund error:", error);
      throw new Error("Failed to process refund");
    }
  }

  async getPaymentMethods(customerId) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      return paymentMethods.data;
    } catch (error) {
      console.error("Get payment methods error:", error);
      throw new Error("Failed to get payment methods");
    }
  }
}

module.exports = new PaymentService();
