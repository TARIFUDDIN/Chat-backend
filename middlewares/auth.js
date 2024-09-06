import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { User } from "../models/user.js";
import { chatApp_Token } from "../constants/config.js";

// to access my profile mean id -> (req.user) via userDB se
const isAuthenticated = (req, res, next) => {
  // console.log("isAuthenticated : ",req.cookies["ChatApp-token"])
  const token = req.cookies[chatApp_Token];
  if (!token)
    return next(new ErrorHandler("Please Login to access this route", 401));
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData._id;

  next();
};

const adminOnly = (req, res, next) => {
  const token = req.cookies["Chat-App-Admin"];
  if (!token)
    return next(new ErrorHandler("only ADMIN casn access this route", 401));
  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) return next(new ErrorHandler("Only Admin can access this route", 401));

  next();
};
const socketAuthenticator = async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new ErrorHandler("Please login to access this route", 401));
    }

    // Extract the token from the cookies
    const authToken = cookies
      .split('; ')
      .find(row => row.startsWith(`${chatApp_Token}=`))
      ?.split('=')[1];

    if (!authToken) {
      return next(new ErrorHandler("Please login to access  route", 401));
    }

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
    const user = await User.findById(decodedData._id);

    if (!user) {
      return next(new ErrorHandler("Please login to access this ", 401));
    }

    // Attach the user to the socket object
    socket.user = user;
    next();
  } catch (error) {
    console.error(error);
    next(new ErrorHandler("Please login to  this route", 401));
  }
};

export { isAuthenticated ,adminOnly, socketAuthenticator};