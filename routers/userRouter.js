import express from "express";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  console.log("request in user router");
  return res.json({
    message: "Hello from user router",
  });
});

export { userRouter };
