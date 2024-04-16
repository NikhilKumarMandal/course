import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken" 
import {uploadOnCloudinary} from "../utils/cloudinary.js"

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
// TEST CASE PASS
const registerUser = asyncHandler( async (req, res) => {
     const {name,email,password} = req.body

     if (
        [name,email,password].some((field) => field.trim() === "")
     ) {
        throw new ApiError(400,"All fields are requried")
     }

    const existedUser =  await User.findOne({
        email
     })

    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists")
    }

    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: avatar?.public_id,
            url: avatar?.url
        },
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201)
    .json(
        new ApiResponse(
            200, 
            createdUser, 
            "User registered Successfully"
        )
    )
    
} )

const loginUser = asyncHandler(async (req, res) =>{

    const { email,password } = req.body
    console.log(email);

    if (!email) {
        throw new ApiError(400, "email is required")
    }
    
    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)
    console.log(isPasswordValid);
   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

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

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (decodedToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res) => {

    const {newPassword,oldPassword} = req.body

    const user = await User.findById(req.user._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
            )
        )  

})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
            )
        )
})

const updateAccountDetails = asyncHandler(async(req,res) => {

    const {fullname, email} = req.body

    console.log(fullname);
    const avatarLocalPath = req.file?.path
 
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!fullname && !email && !avatar) {
        throw new ApiError(400, "at least one field is required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email,
                avatar: avatar?.url
            }
        },
        {
            new: true
        } 
    ).select("-password")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))

})

const googleLogin = asyncHandler(async(req,res,next) => {
    const { email, name, googlePhotoUrl,fullname } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
        const { password, ...rest } = user._doc;

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
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
       
        const newUser = await User.create({
          username:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          fullname,
          password: generatedPassword,
          avatar: googlePhotoUrl,
        });
        await newUser.save();

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(newUser._id)

   const { password, ...rest } = newUser._doc;

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
      }
    } catch (error) {
      next(error);
    }

})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})
  
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    googleLogin,
    updateUserAvatar
 }