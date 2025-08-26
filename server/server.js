import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Apply CORS before routes
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies/authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Hello API is working");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ Database + server start
connectDB()
  .then(() => {
    console.log("DB Connected successfully");
    app.listen(port, () => {
      console.log(`Server running successfully on port ${port}`);
    });
  })
  .catch(() => console.log("DB not connected"));
