import {Router} from "express";

import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { getCart, addtoCart ,deletefromCart} from "../controllers/cart.controller.js";
const router = Router()
router.route("/getCart").post(verifyJWT,getCart)
router.route("/add").post(verifyJWT,addtoCart)
router.route("/delete/:bookId").delete(verifyJWT,deletefromCart)
export default router