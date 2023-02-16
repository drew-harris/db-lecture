import express from "express";
import { userRouter } from "./routers/userRouter.js";

const app = express();

app.get("/", (req, res) => {
  console.log("Recieved request");
  return res.json({ message: "Hello" });
});

app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
