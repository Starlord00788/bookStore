
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

export const verifyAdmin = asyncHandler(async(req , res , next ) => {
   try {
     const token = req.cookies?.accessToken || req.header?.("Authorization").replace("Bearer ","")
 
     if(!token){
         throw new ApiError(401, "Unauthorized request")
     }
 
     const decodedInformation = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
     const user = await User.findById(decodedInformation._id);
     if (!user) {
       throw new ApiError(402, "Invalid Access Token");
     }
 
     if(user.role == "admin"){
         req.user = user
     }
     else{
         throw new ApiError(402,"Only admins can access these panels")
     }
     next();
   } catch (error) {
    throw new ApiError(402,error?.message || "Invalid access token")
   }

})