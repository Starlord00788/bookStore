import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Cart = mongoose.model("Cart", cartSchema);
