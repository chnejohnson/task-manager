import express from "express";
import "./connect.js";
import mongoose from "mongoose";
import userRouter from "./routers/user.router";
import taskRouter from "./routers/task.router";

const app = express();
const port = process.env.PORT || 3000;

mongoose.set("useFindAndModify", false);

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server listen up on port ${port}`);
});
