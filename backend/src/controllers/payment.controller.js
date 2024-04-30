import { nikhil } from "../app.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import crypto from 'crypto'
import { Payment } from "../models/payment.model.js"


const getRazprpayApiKey = asyncHandler(async(req,res) => {
    res.status(200).json({
        status: 200,
        data: { key: process.env.RAZORPAY_KEY_ID },
        message: "Razorpay API key fetched successfully"
    });
})

const buySubscription = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: "User does not exist!!!" });
    }

    if (user.role === 'admin') {
        return res.status(403).json({ message: "Admin cannot purchase a subscription!!" });
    }

    try {
        const subscription = await nikhil.subscriptions.create({
            plan_id: process.env.PLAN_ID,
            customer_notify: 1,
            total_count: 1
        });
    
        if (!subscription || !subscription.id) {
            return res.status(500).json({ message: "Failed to create subscription" });
        }
    
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        await user.save();
    
        return res.status(200).json({
            status: 200,
            data: { subscriptionId: subscription.id },
            message: "Subscribed Successfully"
        });
    } catch (error) {
        console.error("Error buying subscription:", error);
        return res.status(500).json({ message: error?.message || "Something went wrong" });
    }
});


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

    const finalMonths = await getFinalMonths();
    const monthlySalesRecord = await getMonthlySalesRecord();

    const subscription = await nikhil.subscriptions.all({
        count: count || 10
    })

    return res.status(200).json(new ApiResponse(200, {
        subscription,
        finalMonths,
        monthlySalesRecord
    }, "Fetched All data successfully"));

})

const getFinalMonths = async () => {
    // Your logic to fetch final months data
    return ['January', 'February', 'March']; // Example data
};

// Function to fetch monthly sales record from database or API
const getMonthlySalesRecord = async () => {
    // Your logic to fetch monthly sales record data
    return [
        { month: 'January', sales: 100 },
        { month: 'February', sales: 150 },
        { month: 'March', sales: 200 }
    ]; // Example data
};

export {
    getRazprpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayment
}