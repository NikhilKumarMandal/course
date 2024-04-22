import { Router } from 'express';
import {
    contactFrom
} from "../controllers/contact.controller.js"

const router = Router();

router.route("/")
    .post(contactFrom)

export default router