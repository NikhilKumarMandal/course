import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";


const userSchema = new Schema(
    {
        name: {
          type: String,
          required: [true, "Please enter your name"],
        },
        email: {
          type: String,
          required: [true, "Please enter your email"],
          unique: true,
        },
        password: {
          type: String,
          required: [true, "Please enter your password"],
        },
        role: {
          type: String,
          enum: ["admin", "user"],
          default: "user",
        },
      
        subscription: {
          id: String,
          status: String,
        },
      
        avatar: {
          public_id: {
            type: String,
            required: false,
          },
          url: {
            type: String,
            required: false,
          },
        },
      
        playlist: [
          {
            course: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Course",
            },
            poster: String,
          },
        ],
        resetPasswordToken: String,   
        resetPasswordExpire: String,
        },
       {
        timestamps: true
       }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
            isAdmin: this.isAdmin
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            isAdmin: this.isAdmin
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)