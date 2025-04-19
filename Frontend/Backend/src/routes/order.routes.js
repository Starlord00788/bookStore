import {Router} from "express"
import { verifyJWT } from "../middlewares/authentication.middleware.js"
import mongoose from "mongoose";

import { placeOrder ,getOrder, cancelOrder } from "../controllers/order.controller.js"
import { deletefromCart } from "../controllers/cart.controller.js"
import { Order } from "../models/order.model.js"
const router = Router()
router.route("/place").post(verifyJWT,placeOrder)
router.route("/get").get(verifyJWT,getOrder)
router.route("/delete/:orderId").delete(verifyJWT,cancelOrder)

router.post("/create",async(req,res) =>{
    try {
        
        const { userId , items , amount , paymentDetails} = req.body;
        console.log("id",userId);
        const newOrder  = new Order({
            user: userId,
            items,
            amount,
            razorpay_order_id: paymentDetails.razorpay_order_id,
            razorpay_payment_id: paymentDetails.razorpay_payment_id,
            razorpay_signature: paymentDetails.razorpay_signature,
            status: "Paid",
            createdAt: new Date(),
          });

          await newOrder.save();
          res.status(201).json({ success: true, order: newOrder });
    } catch (err) {
        res.status(500).json({success:false, error:err.message});
    }
})
router.route("/user/:id").get(verifyJWT, async (req, res) => {
    try {
        
        
        const userId = new mongoose.Types.ObjectId(req.params.id);
       
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
      } catch (err) {
        console.error("Error fetching orders:", err.message);
        res.status(500).json({ success: false, error: err.message });
      }
  });


export default router