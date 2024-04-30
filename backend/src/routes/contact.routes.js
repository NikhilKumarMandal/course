import { Router } from 'express';
import {
    contactFrom,
    stats
} from "../controllers/contact.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router();

router.route("/")
    .post(contactFrom)

router.route('/stats').get(verifyJWT,stats)

export default router