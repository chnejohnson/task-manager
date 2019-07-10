import express from "express";
import User, { IUser } from "../models/user.model.js";

const router = express.Router();

//let "req.body" be a json format, such as body-parser.
router.use(express.json());

router.post("/users", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.status(400).send(err);
    res.send(user + "saved");
  });
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.schema.statics.findByCredentials(
      req.body.email,
      req.body.password
    );
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates: string[] = ["name", "email", "password"];
  const isValidOperation: boolean = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates" });

  function isValidUpdates(updates: string[]): updates is Array<keyof IUser> {
    return updates.every(isValidUpdate);
  }

  function isValidUpdate(update: string): update is keyof IUser {
    return update in User;
  }

  try {
    const user: IUser | null = await User.findById(req.params.id);
    if (!user) return res.status(404).send();

    if (!isValidUpdates(updates)) throw new Error("Invalid updates type");

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();
    res.send(user).status(201);
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
