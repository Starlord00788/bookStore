import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentID: {
      type: String,
      required: true,
    }, //Payment Gateway ID

    amountPaid: {
      type: Number,
      required: true,
    },
    status: { type: String, enum: ["Success", "Failed"], required: true },
  },
  {
    timestamps: true,
  },
);

export const Payment = mongoose.model("Payment", paymentSchema);
