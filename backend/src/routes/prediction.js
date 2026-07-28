import express from "express";
import Prediction from "../models/prediction.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const newPrediction = new Prediction(req.body);
    await newPrediction.save();
    res.status(201).json({ message: "Prediction saved" });
  } catch (err) {
    res.status(500).json({ message: "Save failed" });
  }
});

export default router;