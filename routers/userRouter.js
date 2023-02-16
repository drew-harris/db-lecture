import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db.js";

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

  const user = await prisma.user.create({
    data: {
      password: hash,
      email: req.body.email,
    },
  });

  const { password, ...rest } = user;

  const token = jwt.sign(rest, process.env.JWT_SECRET, {
    expiresIn: "12d",
  });

  return res.json({ token });
});

export { userRouter };
