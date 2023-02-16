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
  try {
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There was an error", error: error.message });
  }
});

tasksRouter.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id,
      },
    });
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "There was an error", error: error.message });
  }
});

export { tasksRouter };
