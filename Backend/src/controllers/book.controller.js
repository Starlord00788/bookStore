import { Book } from "../models/book.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const getlimitedbooks = asyncHandler(async (req,res)=>{
    try {
        const books = await Book.find().limit(1);
        res.json(books);
      } catch (error) {
        throw new ApiError(500, error?.message || "Server Error");
      }
})

const getBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

const AddBooks = asyncHandler(async (req, res) => {

  const { title, author, price, description ,category,stock} = req.body; // description is not necessary and all books are paid default
  if (
    [title, author, price ,category,stock].some((field) => {
      field?.trim == "";
    })
  ) {
    throw new ApiError(401, " All fields are required");
  }
  const existedbook = await Book.findOne({ title });
  if (existedbook) {
    throw new ApiError(402, "Book with this title already exists");
  }
  console.log(title);
  console.log(req.files);

  const coverImagelocalpath = req.files?.coverImage?.[0]?.path;
  if (!coverImagelocalpath) {
    throw new ApiError(
      401,
      "Cover Image should be Provided for better customer attraction",
    );
  }

  let coverImage;
  try {
    coverImage = await uploadCloudinary(coverImagelocalpath);
  } catch (error) {
    throw new ApiError(401, "Cover Image could not be uploaded to Cloudinary");
  }

  const book = await Book.create({
    title: title,
    author: author,
    price: price,
 
    description,
    stock:stock,
    category:category,

    coverImage: coverImage.url,
  });

  res.status(200).json(new ApiResponse(201, book, " Book successfully added "));
});
const updateBooks = asyncHandler(async (req,res)=>{
try {
        const updatedbook = await Book.findByIdAndUpdate(req.params.id , req.body , {new:true})
        res.json(updatedbook)
} catch (error) {
    throw new ApiError(500, error?.message || "Server Error")
}
})

const deleteBooks = asyncHandler(async(req , res) =>{
   try {
     await Book.findByIdAndDelete(req.params.id);
     res.json("message : Book Deleted")
     
   } catch (error) {
    throw new ApiError(500,error?.message || "Server Error")
   }
})

export { getBooks, AddBooks ,getlimitedbooks , updateBooks , deleteBooks };
