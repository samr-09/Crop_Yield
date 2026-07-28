import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    inputs: {
      rainfall: Number,
      temperature: Number,
      fertilizer: Number,
      co2: Number,
      area: Number
    },
    result: {
      best_crop: String,
      predictions: Object,
      explanations: Array
    }
  },
  { timestamps: true }
);

export default mongoose.model("Prediction", predictionSchema);