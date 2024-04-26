import { razorpay } from "../app.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import crypto from 'crypto'
import { Payment } from "../models/payment.model.js"


const getRazprpayApiKey = asyncHandler(async(req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {key: process.env.RAZORPAY_KEY_ID},
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
    
    if (!user) {
        throw new ApiError(400,"User does not exists!!!")
    }

    const subscriptionId = user.subscription.id

    const genratedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpay_payment_id} |${subscriptionId}`)
    .digest('hex')

    if (genratedSignature !== razorpay_signature) {
        throw new ApiError(500,"Payment not verified,Please try again")
    }

    await Payment.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature
    });

    user.subscription.status = 'active'

    await user.save()

    return res.status(200).json(new ApiResponse(200,"Payement verified successfully"))

})

const cancelSubscription = asyncHandler(async(req,res) => {

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(400,"User does not exists!!!")
    }

    if (user.role === 'admin') {
        throw new ApiError(400,"Admin cannot purchase Subscription!!")
    }

    try {
        const subscriptionId = user.subscription.id
        const subscription = await razorpay.subscriptions.cancel(subscriptionId)
    
        user.subscription.status = subscription.status
    
        await user.save()

        return res.status(200).json(new ApiResponse(200,user,"Payment cancel successfully"))


    } catch (error) {
        throw new ApiError(500,"Something Went wrong")
    }

    
})

const allPayment = asyncHandler(async(req,res) => {
    const {count} = req.query

    const subscription = await razorpay.subscriptions.all({
        count: count || 10
    })

    return res.status(200).json(new ApiResponse(200,subscription,"Feacted All data successfully"))


})

export {
    getRazprpayApiKey,
    buyScription,
    verifySubscription,
    cancelSubscription,
    allPayment
}