import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { AddBooks, getBooks,getlimitedbooks , updateBooks , deleteBooks} from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { verifyAdmin } from "../middlewares/admin.authentication.middleware.js";
const router = Router();
router.route("/addBooks").post(
  upload.fields([
    { name: "coverImage", maxCount: 1 },
   
  ]),verifyAdmin,
  AddBooks,
);
router.route("/getBooks").post(verifyJWT,getBooks);
router.route("/getlimitedbooks").post(getlimitedbooks)
router.route("/updatebooks").post(verifyAdmin,updateBooks)
router.route("/deletebooks").post(verifyAdmin,deleteBooks)
export default router;
