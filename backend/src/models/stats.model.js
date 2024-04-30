import mongoose, {Schema} from "mongoose";

const statsSchema = new Schema({
  users: {
    type: Number,
    default: 0,
  },

  subscription: {
    type: Number,
    default: 0,
  },

  views: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Stats = mongoose.model("Stats", statsSchema)