import mongoose from "mongoose";

const url: any = process.env.MONGODB_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true
});
