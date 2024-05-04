import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance.js"
import {  useNavigate } from 'react-router-dom';

const initialState = {
    isLoggedIn : localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || null,
    data: JSON.parse(localStorage.getItem('data')) || {}
}



export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("users/register", data);
        toast.promise(res, {
            loading: "Wait! creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message || "Unknown error occurred");
    }
})

export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("users/login", data);
        toast.promise(res, {
            loading: "Wait! authentication in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message || "Unknown error occurred");
    }
})

export const logout = createAsyncThunk("/auth/logout", async (data) => {
    try {
        const res = axiosInstance.post("users/logout", data);
        toast.promise(res, {
            loading: "Wait! logout in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message || "Unknown error occurred");
    }
})

export const updateProfile = createAsyncThunk("/user/update-profile", async (data) => {
    try {
        const res = await axiosInstance.patch('users/update-account', data);
        console.log("Res:",res);
        toast.success("Updated successfully!"); 
        console.log(res.data);
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message || "Unknown error occurred");
    }
})

export const getUserData = createAsyncThunk("/user/details", async (data) => {
    try {
        const res = axiosInstance.get('/users/current-user', data);
        
        return (await res).data;
       
        
    } catch(error) {
        toast.error(error?.message || "Unknown error occurred");
    }
})



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (bulider) => {
        bulider
        .addCase(createAccount.fulfilled, (state, action) => {
            console.log("Payload received in createAccount.fulfilled:", action.payload);
            if (action.payload.success) {
                localStorage.setItem('data', JSON.stringify(action.payload.data));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem('role', action.payload.data.role);
                console.log(localStorage.setItem('role', action.payload.data.role));
        
                state.isLoggedIn = true;
                state.data = action.payload.data;
                state.role = action.payload?.data?.role;
                console.log("Redux state after update:", state);
            } else {
                // Handle the case where registration failed
                console.error("User registration failed:", action.payload.message);
            }
        })
        .addCase(login.fulfilled, (state, action) => {
            console.log("Payload received in login.fulfilled:", action.payload);
            if (action.payload.success) {
                // Update localStorage with user data and authentication status
                localStorage.setItem('data', JSON.stringify(action.payload.data));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem('role', action.payload.data.user.role);
        
                // Update Redux state with user data and authentication status
                state.isLoggedIn = true;
                state.role = action.payload.data.user.role;
                state.data = action.payload.data.user; // Assuming the user data is nested under 'user'
        
                console.log("Redux state after update:", state);
            } else {
                // Handle the case where login failed
                console.error("User login failed:", action.payload.message);
            }
        })
        .addCase(logout.fulfilled,(state) => {
            localStorage.clear()
            state.isLoggedIn = false;
            state.data = {};
            state.role = '';
        })
            .addCase(updateProfile.fulfilled, (state, action) => {
             console.log("Payload received in updateProfile.fulfilled:", action.payload);
            if (action.payload.success) {
                // Update localStorage with user data and authentication status
                localStorage.setItem('data', JSON.stringify(action.payload.data));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem('role', action.payload.data.role);
                
                // Create a new state object with updated data
                return {
                    ...state,
                    isLoggedIn: true,
                    data: action.payload.data,
                    role: action.payload.data.role,
                };
            } else {
                // Handle the case where profile update failed
                console.error("Profile update failed:", action.payload.message);
                return state; // Return the current state without changes
            }
        })
        .addCase(getUserData.fulfilled,(state,action) => {
            if (action.payload?.data?.user) {
                localStorage.setItem('data', JSON.stringify(action?.payload?.data?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem('role', action?.payload?.data?.user.role);
        
                state.isLoggedIn = true;
                state.data = action?.payload?.data?.user;
                state.role = action?.payload?.data?.user?.role;
            } else {
                // Handle the case where user data is undefined
                console.error("User data is undefined in login.fulfilled");
            }
        })
    }
})

// export const { } = authSlice.actions

export default authSlice.reducer;