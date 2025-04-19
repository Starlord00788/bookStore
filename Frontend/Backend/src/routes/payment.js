import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {Order} from '../models/order.model.js';
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

// Create an order
router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 10000, // Razorpay takes amount in paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature   } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
    console.log("Verify log hit");
    console.log(req.body);
  if (expectedSignature === razorpay_signature) {

   

    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }






});

export default router;
