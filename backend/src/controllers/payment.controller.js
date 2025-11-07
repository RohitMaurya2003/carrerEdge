import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// Initialise Razorpay with keys from environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order on Razorpay and return order details to the client
// Expected body: { amount: <number in paise> }
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount, // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({ message: "Failed to create order" });
  }
};

// Verify payment signature and activate subscription for the user
// Expected body: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // signature valid -> update user's subscription
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    // For demo, give 30 days subscription. Adjust as needed.
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    user.subscription = {
      active: true,
      startedAt: now,
      expiresAt,
    };

    await user.save();

    return res.json({ message: "Payment verified, subscription activated" });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};

// Note: protectRoute is applied in the route definitions. The controller assumes req.user is available.
