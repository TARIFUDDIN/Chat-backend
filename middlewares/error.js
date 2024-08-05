const errorMiddleware = (err, req, res, next) => {
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

    const response = {
        success: false,
        message: err.message,
      };
    
     
      return res.status(err.statusCode).json(response);
    };
    

    const TryCatch = (passedFunc) => async (req, res, next) => {
        try {
          await passedFunc(req, res, next);
        } catch (error) {
          next(error);
        }
      };
      
      export { errorMiddleware, TryCatch };