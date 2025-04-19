import { Router } from "express";
import {upload } from "../middlewares/multer.middlewares.js"
import { registerUser , loginUser, logoutUser ,refreshAccessToken,getCurrentUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { verifyAdmin } from "../middlewares/admin.authentication.middleware.js";
import { verifyOTP } from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(
    upload.fields([
    {
        name:"avatar",
        maxCount:1,
    }

    ]),
    registerUser, 
);
router.route("/me").get(verifyJWT, getCurrentUser);

router.route("/verify-otp").post(verifyOTP);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-Accesstoken").post(refreshAccessToken)
export default router ;