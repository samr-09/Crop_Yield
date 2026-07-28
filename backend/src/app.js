import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors());
app.use(express.json()); // for JSON body parsing

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);

/* ---------- Health Check ---------- */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "CropYield Backend Running 🚀",
  });
});

/* ---------- Global Error Handler (safe) ---------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;
