import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log("Recieved request");
  console.log("Recieved request");
  return res.json({ message: "Hello" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
