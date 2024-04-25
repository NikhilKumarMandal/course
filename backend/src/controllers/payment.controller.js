import { razorpay } from "../app.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"



const getRazprpayApiKey = asyncHandler(async(req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.payment,
            "User fetched successfully"
            )
        )
})

const buyScription = asyncHandler(async(req,res) => {
    
    const user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(400,"User does not exists!!!")
    }

    if (user.role === 'admin') {
        throw new ApiError(400,"Admin cannot purchase Subscription!!")
    }

    const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.PLAN_ID,
        customer_notify: 1,      
    })
    

    user.subscription.id = subscription.id
    user.subscription.status = subscription.status

    await user.save()

    return res.status(200).json(new ApiResponse(200, subscription.id, "Subscribed Successfully"));

})

const verifySubscription = asyncHandler(async(req,res) => {

    const {razorpay_payment_id,razorpay_subscription_id,razorpay_signature} = req.body
    
    const user = await User.findById(req.user?._id)


})

const cancelSubscription = asyncHandler(async(req,res) => {

})

const allPayment = asyncHandler(async(req,res) => {

})

export {
    getRazprpayApiKey,
    buyScription,
    verifySubscription,
    cancelSubscription,
    allPayment
}