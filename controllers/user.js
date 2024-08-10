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
        public_id: "gyfhhyfg",
        url: "yufhgyfutygf",
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
      
        const user = await User.findOne({ username }).select("+password");
      
        if (!user)
          return next(new ErrorHandler("Invalid Username or Password", 404));
      
        const isMatch = await compare(password, user.password);
        if (!isMatch)
          return next(new ErrorHandler("Invalid Username or Password", 404));
      
        sendToken(res, user, 200, `Welcome Back, ${user.name}`);
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
const searchUser=TryCatch(async (req,res,next)=>{
  const {name}=req.query;

return res
.status(200)
.json({
  success:true,
  message:"",
})
});
export { login, newUser, getMyProfile,logout,searchUser };
