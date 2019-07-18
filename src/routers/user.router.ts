import express, { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import auth from "../middleware/auth";
import multer from "multer";

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

//Update Profile
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates: string[] = ["name", "email", "password"];
  const isValidOperation: boolean = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates" });

  try {
    const user = res.locals.user;
    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();
    res.send(user).status(201);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//Delete Profile
router.delete("/users/me", auth, async (req, res) => {
  try {
    await res.locals.user.remove();
    res.send(res.locals.user);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//Multer settings
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload .jpg, .jpeg or .png file"), false);
    }

    cb(null, true);
  }
});

//Upload avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    res.locals.user.avatar = req.file.buffer;
    await res.locals.user.save();
    res.send();
  },
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({ error: error.message });
  }
);

//Delete avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  res.locals.user.avatar = undefined;
  await res.locals.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error("Can't find the user or user's avatar.");
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
