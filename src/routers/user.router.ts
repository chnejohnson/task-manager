import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

//let "req.body" be a json format, such as body-parser.
router.use(express.json());

router.post("/users", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.status(400).send(err);
    console.log(doc + " be saved.");
    res.send(user + "saved");
  });
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
    console.log(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(400).send();
    res.send(user + " is deleted.");
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
