import express, { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import auth from "../middleware/auth";

const router = express.Router();

//let "req.body" be a json format, such as body-parser.
router.use(express.json());

//sign up
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(500).send(e);
  }
});

//login in
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//Logout
router.post("/users/logout", auth, async (req: Request, res: Response) => {
  try {
    res.locals.user.tokens = res.locals.user.tokens.filter((token: any) => {
      return token.token !== res.locals.token;
    });
    await res.locals.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//Logout all
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    res.locals.user.tokens = [];
    await res.locals.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//Read Profile
router.get("/users/me", auth, async (req: Request, res: Response) => {
  res.send(res.locals.user);
});

//Update
router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates: string[] = ["name", "email", "password"];
  const isValidOperation: boolean = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates" });

  try {
    const user = await User.findById(req.params.id);
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

  function isValidUpdates(updates: string[]): updates is Array<keyof IUser> {
    return updates.every(isValidUpdate);
  }

  function isValidUpdate(update: string): update is keyof IUser {
    return update in User;
  }
});

//Delete
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
