import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary} from "../utils/cloudinary.js"
import { Course } from '../models/course.model.js';
import { Stats } from '../models/stats.model.js';



const createCourse = asyncHandler(async(req,res) => {

    const { title, description, category,createdBy } = req.body;

    if (
        [title,description,category,createdBy].some((field) => field.trim() === '')
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
        },
        createdBy
    })

    if (!course) {
        throw new ApiError(500,"Something went while create course")
    }

    return res.status(200).json(
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

  return res.status(200).json(
    new ApiResponse(
        200,
        courses,
        "Course fetched successfully"
    ))

})

const deleteCourse = asyncHandler(async(req,res) => {
    const {id} = req.params

    const course = await Course.findByIdAndDelete(id)

    if (!course) {
        throw new ApiError(404,"Course not found")
    }

    return res.status(200).json(new ApiResponse(200,{},"Course delete successfully"))
})

const getCourseLectures = asyncHandler(async(req,res) => {
    const {id} = req.params;

    const course = await Course.findById(id)
    if (!course) {
        throw new ApiError(404, "Course not found")
    }
    course.views += 1;
    await course.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            course,
            "Course fetched successfully"  
        ))
})

const addLectureIntoCourse = asyncHandler(async(req,res) => {  
    const {id} = req.params
    const {title,description} = req.body

    const course = await Course.findById(id)
    if (!course) {
        throw new ApiError(400,"Course Does not exists")
    }
    ;

    if (
        [title,description].some((field) => field?.trim() === '')
    ) {
        throw new ApiError(400,"All fields are requried")
    }

    let avatarLocalPath;
    console.log(avatarLocalPath);
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avvatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    await course.lectures.push({
        title,
        description,
        avatar: {
          public_id: avatar.public_id,
          url: avatar.url,
        },
    })

    course.numOfVideos = course.lectures.length

    await course.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            course,
            "Add Lecture successfully"
        ))
})

const deleteLectureFromCourse = asyncHandler(async(req,res) => {
    const { courseId, lectureId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Check if the lecture exists in the course
    const lectureExists = course.lectures.some(lecture => lecture._id.toString() === lectureId);
    if (!lectureExists) {
        throw new ApiError(404, "Lecture not found in this course");
    }

    // Remove the lecture from the lectures array
    course.lectures = course.lectures.filter(lecture => lecture._id.toString() !== lectureId);

    course.numOfVideos = course.lectures.length

    await course.save();

    return res.status(200).json(new ApiResponse(200,{courseId,lectureId},"Leacture delete Successfully"))
})

// Course.watch().on("change", async () => {
//     try {
//       const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);
  
//       if (stats.length > 0) {
//         const courses = await Course.find({});
  
//         let totalViews = 0;
  
//         for (let i = 0; i < courses.length; i++) {
//           totalViews += courses[i].views;
//         }
//         stats[0].views = totalViews;
//         stats[0].createdAt = new Date(Date.now());
  
//         await stats[0].save();
//       } else {
//         console.error("No stats found.");
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//     }
//   });
  
  

export {
    createCourse,
    getAllCourses,
    getCourseLectures,
    addLectureIntoCourse,
    deleteLectureFromCourse,
    deleteCourse
}