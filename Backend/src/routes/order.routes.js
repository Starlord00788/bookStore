import {Router} from "express"
import { verifyJWT } from "../middlewares/authentication.middleware.js"
import { placeOrder ,getOrder, cancelOrder } from "../controllers/order.controller.js"
import { deletefromCart } from "../controllers/cart.controller.js"

const router = Router()
router.route("/place").post(verifyJWT,placeOrder)
router.route("/get").get(verifyJWT,getOrder)
router.route("/delete/:orderId").delete(verifyJWT,cancelOrder)
export default router