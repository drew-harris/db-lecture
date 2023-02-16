import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../db.js";

const tasksRouter = express.Router();

tasksRouter.use((req, res, next) => {
  const token = req.headers.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedJwt;

  next();
});

tasksRouter.post("/", async (req, res) => {
  console.log("BODY: ", req.body);
  console.log("USER: ", req.user);

  const task = await prisma.task.create({
    data: {
      title: req.body.title,
      User: {
        connect: {
          id: req.user.id,
        },
      },
      complete: false,
    },
  });

  res.json({ task });
});

export { tasksRouter };
