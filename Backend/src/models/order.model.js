import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
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
        quantity:{
          type:Number,
          required:true,
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status:{
      type:String,
      enum:["Processing","Confirmed","Shipped","Delivered","Cancelled"],
      default:"Processing",
    }
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model("Order", orderSchema);
