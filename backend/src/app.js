import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import Razorpay from 'razorpay'
import nodeCron from 'node-cron'
import { Stats } from "./models/stats.model.js"

const app = express()
  console.log("ENV",process.env.FRONTEND_URL);
app.use(cors({
  origin:'https://course-nine-amber.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: true
  // allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({limit: "116kb"}))
app.use(express.urlencoded({extended: true, limit: "116kb"}))
app.use(express.static("public"))
app.use(cookieParser())

nodeCron.schedule("0 0 0 1 * *",async () => {
  try {
    
    await Stats.create({})
  } catch (error) {
    console.log(error);
  }
})

const temp = async() => {
  await Stats.create({})
}

temp()

export const nikhil = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

//routes import
import userRouter from "./routes/user.routes.js"
import courseRouter from './routes/course.routes.js'
import contactRouter from './routes/contact.routes.js'
import paymentRouter from './routes/payment.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/courses", courseRouter)
app.use("/api/v1/contact", contactRouter)
app.use("/api/v1/payment", paymentRouter)





export { app }
