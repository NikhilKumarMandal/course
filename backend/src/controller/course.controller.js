import { ApiError } from '../utils/ApiError/js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Course } from '../models/course.model.js';


const createCourse = asyncHandler(async(req,res) => {

    const { title, description, category } = req.body;

    if (
        [title,description,category].some((field) => field.trim() === '')
    ) {
        throw new ApiError(400,"All fields are requried")
    }

    let posterLocalPath;
    if (req.files && Array.isArray(req.files.poster) && req.files.poster.length > 0) {
        posterLocalPath = req.files.poster[0].path
    }
    
    if (!posterLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const poster = await uploadOnCloudinary(posterLocalPath);

    const course = await Course.create({
        title,
        description,
        category,
        poster: {
            public_id: poster?.public_id,
            url: poster?.url
        }
    })

    if (!course) {
        throw new ApiError(500,"Something went while create course")
    }

    return res.json(
        new ApiResponse(
            200,
            course,
            "Course create successfully"
        ))
})

const getAllCourses = asyncHandler(async(req,res) => {
    const { keyword = "", category = "" } = req.query;

  const filter = {
    title: { $regex: keyword, $options: "i" },
    category: { $regex: category, $options: "i" },
  };

  const courses = await Course.find(filter).select("-lectures");

  return res.json(
    new ApiResponse(
        200,
        courses,
        "Course fetched successfully"
    ))
    
})