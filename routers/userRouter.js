import express from "express";
import bcrypt from "bcrypt";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  console.log("request in user router");
  return res.json({
    message: "Hello from user router",
  });
});

userRouter.post("/signup", async (req, res) => {
  console.log("signup request");
  console.log(req.body);

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);
  console.log(hash);

  return res.json({ message: "User Created" });
});

export { userRouter };
