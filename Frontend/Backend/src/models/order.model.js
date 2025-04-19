import mongoose,{Schema} from 'mongoose';

const orderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      title: String,
      price: Number,
      quantity: Number,
      bookId: String,
    }
  ],
  razorpay_order_id:{
    type:String,
    
  },
  razorpay_payment_id: String,
  razorpay_signature:String,
  status: { type: String, default: "Pending" },
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

export const Order =  mongoose.model("Order", orderSchema);
