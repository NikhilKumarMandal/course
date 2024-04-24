import { Router } from "express";
import {
     registerUser,
     loginUser,
     logoutUser,
     refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()




router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
       
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)


router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").put(verifyJWT,upload.single("avatar"), updateAccountDetails)



export default router