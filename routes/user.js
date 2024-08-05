import express from "express";

import { getMyProfile, login, logout, newUser } from "../controllers/user.js";
import  {singleAvatar}from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
const app=express.Router();

app.post("/new",singleAvatar,newUser);
app.post("/login",login);
//user must be logged In
app.get("/me",isAuthenticated,getMyProfile);
app.get("/logout",logout);

export default app;