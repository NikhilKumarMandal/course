import { Router } from 'express';
import {
    createCourse,
    getAllCourses,
} from "../controllers/course.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

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



export default router