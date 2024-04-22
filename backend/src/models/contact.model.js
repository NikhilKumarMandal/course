import mongoose, {Schema} from "mongoose";

const contactSchema = new Schema(
    {
        name: {
          type: String,
          required: [true, "Please enter your name"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
        },
        message: {
        type: String,
          required: [true, "Please enter your message"],
        }
    },
    {
        timestamps: true
    }
)




export const Contact = mongoose.model("Contact", contactSchema)