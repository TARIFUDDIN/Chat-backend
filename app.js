import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import dotenv from 'dotenv';
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

dotenv.config({
    path: "./.env",
});

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3001; 
connectDB(mongoURI);

app.use("/user", userRoute);
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hello world");
});

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
