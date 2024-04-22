import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slices/AuthSlice";
import CourseSlice from "./slices/CourseSlice";

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        course: CourseSlice
    }
})

export default store