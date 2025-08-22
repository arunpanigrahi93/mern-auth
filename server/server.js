import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

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
  res.send("Hello API ");
});

app.listen(port, () => {
  console.log(`server running successfully on port ${port}`);
});
