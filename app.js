import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import dotenv from 'dotenv';
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import {v4 as uuid} from 'uuid';
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import {  v2 as  cloudinary} from 'cloudinary';
import  cors  from 'cors';
dotenv.config({
    path: "./.env",
});
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3001; 
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY||"adsasdsdfsdfsdfd";
const userSocketIDs=new Map();
connectDB(mongoURI);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
const server=createServer(app);
const io=new Server(server,{});
app.use(express.json());
app.use(cookieParser());

app.use(cors({
origin:[
  
  process.env.CLIENT_URL,
],
credentials:true,
}));


app.use("/user", userRoute);
app.use("/chat",chatRoute);
app.use("/admin",adminRoute);
app.get("/", (req, res) => {
    res.send("hello world");
});
io.use((socket,next)=>{});
io.on("connection" ,(socket)=>{

    const user={
        _id:"asdsda",
        name:"tarif"
    };
    userSocketIDs.set(user._id.toString(), socket.id);

    console.log(userSocketIDs);
    socket.on(NEW_MESSAGE,async({chatId,members,messages})=>{

        const messageForRealTime = {
            content: messages,
            _id: uuid(),
            sender: {
              _id: user._id,
              name: user.name,
            },
            chat:chatId,
            createdAt: new Date().toISOString(),
        };
        const messageForDB = {
            content: messages,
            sender: user._id,
            chat: chatId,
          };
      
          const membersSocket =getSockets(members);
          io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime,
          });
          io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });
          try {
            await Message.create(messageForDB);
          } catch (error) {
            throw new Error(error);
          }

console.log("New Message",messageForRealTime);
    });
    socket.on("disconnect",()=>{
        console.log("user disconnected");
        userSocketIDs.delete(user._id.toString());
    });
});
app.use(errorMiddleware);

server.listen(port, () => {
    console.log(`Server is running on port ${port} in ${envMode} Mode`);
  });
  export { envMode, adminSecretKey};