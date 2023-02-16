import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./routers/userRouter.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Recieved request");
  return res.json({ message: "Hello" });
});

app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
