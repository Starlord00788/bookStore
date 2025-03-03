import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateACCESSandREFRESHtokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user)
    const accessToken = user.generateACCESStoken();
    
    const refreshToken = user.generateREFRESHtoken();

    user.refreshToken = refreshToken;
 
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error generatting tokens",error)
    throw new ApiError(
      402,
      "Something went wrong while generating access and refresh Tokens",
    );
  }
};
   
const registerUser = asyncHandler(async (req, res) => {
  // so first we will write the steps for sign up or registering the user
  //receive the data from the user or frontend
  // check for validation - for now just check it empty
  //check for username and email if db if a user already exists with this username
  //take avatar as a input
  //upload them to cloudinary an also check
  // create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return the response

  const { username, fullname, email, password } = req.body;
  console.log(email);

  if (
    [username, fullname, email, password].some((field) => {
      field?.trim == "";
    })
  ) {
    throw new ApiError(400, " All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(401, " User with this email or username already exists");
  }

  const avatarlocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarlocalPath) {
    throw new ApiError(401, " Avatar not found and is required");
  }

  let avatar;
  try {
    avatar = await uploadCloudinary(avatarlocalPath);
  } catch (error) {
    throw new ApiError(402, " The file could not be uploaded on cloudinary");
  }
  console.log("Avatar uploaded successfully", avatar);

  const user = await User.create({
    username: username.toLowerCase(),
    fullname: fullname,
    email: email,
    password,
    avatar: avatar.url,
    
  });

  const createdUser = await User.findById(user._id).select(
    "-refreshToken -password",
  );

  if (!createdUser) {
    throw new ApiError(402, " Something went wrong while registering User");
  }
  const Response = new ApiResponse(
    201,
    createdUser,
    "User successfullly registered",
  );
  console.log("Response", Response);
  return res.status(201).json(Response);
});

const loginUser = asyncHandler(async (req, res) => {
  //todos
  // take input from the frontend
  // check for the username and email if they exists in the db
  //now check for password if corrct or not
  //generate access and refresh tokens
  //send cookies
  //return response

  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(401, "At least one of username and email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "User doesnot exists in the database");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(402, " Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateACCESSandREFRESHtokens(
    user._id,
  );
  const loggedUser = await User.findById(user._id).select(
    "-refreshToken -password",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { loggedUser, accessToken, refreshToken },
        "User loggged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async(req,res) =>{

await User.findByIdAndUpdate(
  req.user._id, {
    $set: {refreshToken:undefined}
  },
  {
    new:true,
  }
)

const options ={
  httpOnly:true,
  secure:true,
}
return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200, " User has been logged out successfully"));


});

const refreshAccessToken = asyncHandler(async(req,res) =>{
  
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
if(!incomingRefreshToken){
  throw new ApiError(401,"Unauthorized request")
}

const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

const user = await User.findById(decodedToken._id)
if(!user){
  throw new ApiError(401,"Invalid request")
}

if(incomingRefreshToken!==user.refreshToken){
  throw new ApiError(402,
    "Access Denied or refresh token expired"
  )
  
}
const options = {
  httpOnly:true,
  secure:true,
}

const {accessToken , newRefreshTOken} = generateACCESSandREFRESHtokens(user._id)
return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",newRefreshTOken,options)
.json(
  new ApiResponse(201 ,{accessToken, refreshToken:newRefreshTOken}, "Access Token refreshed" )
)


})

export { registerUser, loginUser ,logoutUser ,refreshAccessToken};
