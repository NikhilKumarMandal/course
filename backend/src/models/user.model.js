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
            required: true,
          },
          url: {
            type: String,
            required: true,
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
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1day'
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '10day'
        }
    )
}


export const User = mongoose.model("User", userSchema)