import rateLimit from "express-rate-limit";

 const limiter = (time:number,limit:number) => rateLimit({
  
  windowMs: time * 60 * 1000,
  limit: limit, 
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export default limiter ;