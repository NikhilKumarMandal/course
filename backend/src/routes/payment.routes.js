import { Router } from 'express';
import {verifyJWT} from "../middlewares/auth.middleware.js"

import {
    getRazprpayApiKey,
    buyScription,
    verifySubscription,
    cancelSubscription,
    allPayment
} from '../controllers/payment.controller.js'

const router = Router();
router.use(verifyJWT); 


router
    .route('/razorpay-key')
    .get(
        verifyJWT,
        getRazprpayApiKey
    )

router
    .route('/subscribe')
    .post(
        verifyJWT,
        buyScription
    )

router
    .route('/verify')
    .post(
        verifyJWT,
        verifySubscription
    )

router
    .route('/unSubscribe')
    .post(
        verifyJWT,
        cancelSubscription
    )

router
    .route('/')
    .get(
        verifyJWT,
        allPayment
    )

export default router