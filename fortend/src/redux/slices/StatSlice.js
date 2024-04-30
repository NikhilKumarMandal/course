import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../helpers/axiosInstance.js";
const initialState = {
    usersCount: 0,
    subscriptionCount: 0,
};

export const getStatsData = createAsyncThunk("stats/get", async () => {
    try {
        const response = axiosInstance.get("/contact/stats");
        toast.promise(response, {
            loading: "Getting the stats...",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to load data stats"
        });
        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})

const statSlice = createSlice({
    name: "state",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStatsData.fulfilled, (state, action) => {
            console.log("Payload received in getStatsData.fulfilled:", action.payload);
            state.usersCount = action?.payload?.usersCount;
            state.subscribedCount =  action?.payload?.subscriptionCount;
        })
    }
});

export default statSlice.reducer;