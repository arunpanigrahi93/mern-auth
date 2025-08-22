import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello API is working");
});

app.use("/api/auth", authRouter);

connectDB()
  .then(() => {
    console.log("DB Connected successfully");
    app.listen(port, () => {
      console.log(`server running successfully on port ${port}`);
    });
  })
  .catch(() => console.log("DB not connected"));
