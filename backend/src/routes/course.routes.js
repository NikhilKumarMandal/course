import { Router } from 'express';
import {
    createCourse,
    getAllCourses,
    getCourseLectures,
    addLectureIntoCourse
} from "../controllers/course.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT);
router
    .route("/")
    .get(getAllCourses)
    .post(
        upload.fields([
            {
                name: 'poster',
                maxCount: 1,
            },
            
        ]),
        createCourse
    );

router
    .route("/:id")
    .get(getCourseLectures)

router.route("/:id").post(verifyJWT,upload.fields([{name:"avatar"}]), addLectureIntoCourse)




export default router