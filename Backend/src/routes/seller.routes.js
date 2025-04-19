import express from 'express';
import { verifyJWT } from '../middlewares/authentication.middleware.js';
import {
  becomeSeller,
  getSellerInfo,
  getSellerBooks,
  addSellerBook,
  updateSellerBook,
  deleteSellerBook
} from '../controllers/seller.controller.js';

const router = express.Router();

router.post('/become', verifyJWT , (req, res, next) => {
    console.log("🚀 /become route hit!");
    next();
  }, becomeSeller);
router.get('/me', verifyJWT, getSellerInfo);
router.get('/mybooks', verifyJWT, getSellerBooks);
router.post('/addbook', verifyJWT, addSellerBook);
router.put('/updatebook/:id', verifyJWT, updateSellerBook);
router.delete('/deletebook/:id', verifyJWT, deleteSellerBook);

export default router;
