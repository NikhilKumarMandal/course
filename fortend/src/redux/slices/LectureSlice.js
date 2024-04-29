import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../helpers/axiosInstance.js";

const initialState = {
    lectures: []
}

export const getCourseLectures = createAsyncThunk("/course/lecture/get", async (id) => {
    try {
        const response = axiosInstance.get(`/courses/${id}`);
        toast.promise(response, {
            loading: "Fetching course lectures",
            success: "Lectures fetched successfully",
            error: "Failed to load the lectures"
        });
        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const addCourseLecture = createAsyncThunk("/course/lecture/add", async (id) => {
    try {
        const formData = new FormData();
        formData.append("avatar", data.avatar);
        formData.append("title", data.title);
        formData.append("description", data.description);

        const response = axiosInstance.post(`/courses/${id}`, formData);
        toast.promise(response, {
            loading: "adding course lecture",
            success: "Lecture added successfully",
            error: "Failed to add the lectures"
        });
        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const deleteCourseLecture = createAsyncThunk("/course/lecture/delete", async (data) => {
    try {

        const response = axiosInstance.delete(`courses/${data.courseId}/lectures/${data.lectureId}`);
        toast.promise(response, {
            loading: "deleting course lecture",
            success: "Lecture deleted successfully",
            error: "Failed to delete the lectures"
        });
        return (await response).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCourseLectures.fulfilled, (state, action) => {
            console.log("Payload received in login.fulfilled:", action.payload);
            state.lectures = action?.payload?.data?.lectures;
        })
        .addCase(addCourseLecture.fulfilled, (state, action) => {
            console.log(action);
            state.lectures = action?.payload?.course?.lectures;
        })
    }
});

export default lectureSlice.reducer;