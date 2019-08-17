import express from "express";
import "./connect.js";
import mongoose from "mongoose";
import userRouter from "./routers/user.router";
import taskRouter from "./routers/task.router";
// import cors from "./middleware/cors";
import cors from "cors";

const app = express();

mongoose.set("useFindAndModify", false);

app.use(cors);

app.use(userRouter);
app.use(taskRouter);

export default app;
