import { User } from "../models/user.js";
import { compare } from "bcrypt";
import { sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
const newUser = TryCatch(async (req, res, next) => {
    
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file); 

    const { name, username, password, bio } = req.body;
  
    const avatar = {
        public_id: req.file ? req.file.filename : "default_id",
        url: req.file ? `uploads/${req.file.filename}` : "default_url",
    };
    const user = await User.create({
        name,
        bio,
        username,
        password,
        avatar,
      });
      
    sendToken(res, user, 201, "User created successfully");
});

    

    const login = TryCatch(async (req, res, next) => {
        const { username, password } = req.body;
      
        const userDB = await User.findOne({ username }).select("+password");
      
        if (!userDB)
          return next(new ErrorHandler("Invalid Username or Password", 404));
      
        const isMatch = await compare(password, userDB.password);
        if (!isMatch)
          return next(new ErrorHandler("Invalid Username or Password", 404));
      
        sendToken(res, userDB, 200, `Welcome Back, ${userDB.name}`);
      });
      

const getMyProfile = TryCatch(async(req, res) => {
  const user=  await User.findById(req.user);
    res.status(200).json({
        success:true,
        user,
    });
});
const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("chit-chat", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
export { login, newUser, getMyProfile,logout };
