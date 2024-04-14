import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError/js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async(req,res) => {

    const {name,email,password} = req.body;

    if (
        [name, email, password].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400,"All fields are requried")
    }

    const existedUser = User.findOne({email})

    if (existedUser) {
        throw new ApiError(409,'Email has already been registered') 
    }

    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = User.create({
        name,
        email,
        password,
        avatar: {
            public_id: avatar?.public_id,
            url: avatar?.url
        }
    })

    const createdUser = await User.findById(user?._id).select("-password")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdUser,
            "User registered Successfully"
        )
    )

})

const loginUser = asyncHandler(async(req,res) => {

    const {email,password} = req.body

    if (!email || !password) {
        throw new ApiError(409,"Please enter all the  fields")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404,"User does not find")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
       httpOnly: true,
       secure: true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
       new ApiResponse(
           200, 
           {
               user: loggedInUser, accessToken, refreshToken
           },
           "User logged In Successfully"
       )
   )
   
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged Out"
            )
        )
})




export {
    registerUser,
    loginUser,
    logoutUser
}