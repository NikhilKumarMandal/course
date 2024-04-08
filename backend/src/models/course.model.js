import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "Please enter your name"],
      minLength: [10,"title must be at least 50 characters"],
      maxLength: [30,"title must be under 30 characters"]
    },
    description: {
      type: String,
      required: [true, "Please provide your description"],
      minLength: [20,"description must be at least 20 characters"]
    },
    lectures: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            video: {
                public_id: {
                  type: String,
                  required: true,
                },
                url: {
                  type: String,
                  required: true,
                },
              },
        }
    ],
    
    poster: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    views:{
        type: Number,
        default: 0
    },
    numOfVideos: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    }
  
    },
   {
    timestamps: true
   }
);

export const Course = mongoose.model("Course", courseSchema);