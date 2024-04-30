import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance.js";

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
}

export const getRazorpayId = createAsyncThunk('razorpay/getId', async () => {
    try {
        const res = await axiosInstance.get('/payment/razorpay-key');
        return res.data;
    } catch (error) {
        toast.error("Failed to Load Data");
        throw error; // Re-throw the error to propagate it to the UI
    }
});

export const purchaseCourseBundle = createAsyncThunk('purchase/Course', async () => {
    try {
        const res = await axiosInstance.get('/payment/subscribe');
        console.log(res);
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error; // Re-throw the error to propagate it to the UI
    }
});

export const verifyUserPayment = createAsyncThunk("payments/verify", async (data) => {
    try {
        const response = await axiosInstance.post("/payments/verify", {
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_subscription_id: data.razorpay_subscription_id,
            razorpay_signature: data.razorpay_signature
        });
        return response.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
        throw error; // Re-throw the error to propagate it to the UI
    }
});

export const getPaymentRecord = createAsyncThunk("payments/record", async () => {
    try {
        const response = await axiosInstance.get("payment/");
        console.log("Res:",res);
        toast.success("Updated successfully!"); 
        console.log(res.data);
        return (await res).data;
        return response.data;
    } catch(error) {
        toast.error("Operation failed");
        throw error; // Re-throw the error to propagate it to the UI
    }
});

export const cancelCourseBundle = createAsyncThunk("payments/cancel", async () => {
    try {
        const response = await axiosInstance.post("/payments/unsubscribe");
        toast.promise(response, {
            loading: "Unsubscribing the bundle",
            success: (data) => data?.data?.message || "Success",
            error: "Failed to unsubscribe"
        });
        return response.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
        throw error; // Re-throw the error to propagate it to the UI
    }
});

const razorpaySlice = createSlice({
    name: 'razorpay',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getRazorpayId.fulfilled, (state, action) => {
            console.log("Payload received in getRazorpayId.fulfilled:", action.payload);
            state.key = action.payload?.data?.key || '';
        })
        .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
            console.log("Payload received in purchaseCourseBundle.fulfilled:", action.payload);
            state.subscription_id = action.payload?.data?.subscriptionId || '';
        })
        .addCase(verifyUserPayment.fulfilled, (state, action) => {
            toast.success(action.payload.message);
            state.isPaymentVerified = action.payload.success || false;
        })
        .addCase(verifyUserPayment.rejected, (state, action) => {
            toast.error(action.error.message || "Payment verification failed");
            state.isPaymentVerified = false;
        })
        .addCase(getPaymentRecord.fulfilled, (state, action) => {
            console.log("Payload received in getPaymentRecord.fulfilled:", action.payload);
            const { allPayments, finalMonths, monthlySalesRecord } = action.payload;
            state.allPayments = allPayments || {};
            state.finalMonths = finalMonths || {};
            state.monthlySalesRecord = monthlySalesRecord || [];
        })
    }
});

export default razorpaySlice.reducer;
