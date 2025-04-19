import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addBook, getBooks,getlimitedbooks , updateBooks , deleteBooks,relatedBooks,fetchBooksFromGoogle} from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { verifyAdmin } from "../middlewares/admin.authentication.middleware.js";
const router = Router();
router.route("/addBook").post(verifyAdmin,
  addBook,
);
router.route("/fetch-google-books").post(verifyAdmin, fetchBooksFromGoogle);
router.route("/getBooks").post(verifyJWT,getBooks);
router.route("/relatedbooks").post(verifyJWT,relatedBooks);
router.route("/getlimitedbooks").post(getlimitedbooks)
router.route("/updatebooks").post(verifyAdmin,updateBooks)
router.route("/deletebooks").post(verifyAdmin,deleteBooks)
export default router;
