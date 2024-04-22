import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "Please enter your name"],
      minLength: [5,"title must be at least 5 characters"],
      maxLength: [30,"title must be under 30 characters"]
    },
    description: {
      type: String,
      required: [true, "Please provide your description"],
      minLength: [10,"description must be at least 10 characters"]
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
    },
    createdBy: {
      type: String,
      required: true
    }

    },
   {
    timestamps: true
   }
);

export const Course = mongoose.model("Course", courseSchema);