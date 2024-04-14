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
        throw new ApiError(400, "Poster file is required")
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

const getCourseLectures = asyncHandler(async(req,res) => {
    const courseId = req.params._id;

    const course = await Course.findById(courseId)
    if (!course) {
        throw new ApiError(404, "Course not found")
    }
    course.views += 1;
    await course.save()

    return res.json(
        new ApiResponse(
            200,
            course,
            "Course fetched successfully"  
        ))
})

const addLectureIntoCourse = asyncHandler(async(req,res) => {
    const courseId = req.params._id;

    const course = await Course.findById(courseId)
    if (!course) {
        throw new ApiError(404, "Course not found")
    }

    let videoLocalPath;
    if (req.files && Array.isArray(req.files.video) && req.files.video.length > 0) {
        videoLocalPath = req.files.video[0].path
    }
    
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    const video = await uploadOnCloudinary(videoLocalPath);

    course.lectures.push({
        title,
        description,
        video: {
          public_id: video.public_id,
          url: video.secure_url,
        },
      });
    
      course.numOfVideos = course.lectures.length;
    
      await course.save();

      return res.json(
        new ApiResponse(
            200,
            course,
            "Add Lecture successfully"
        ))
        
})