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

userRouter.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "bad request" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "unauthorized" });
    }

    // eslint-disable-next-line
    const { password, ...userWithoutPassword } = user;

    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: "12d",
    });

    return res.json({ jwt: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    console.log("signup request");
    console.log(req.body);

    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
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

    // eslint-disable-next-line
    const { password, ...rest } = user;

    const token = jwt.sign(rest, process.env.JWT_SECRET, {
      expiresIn: "12d",
    });

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { userRouter };
