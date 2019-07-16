import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header("Authorization");
    if (!token) throw new Error();
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisisprivatekey");
    const user = await User.findOne({
      _id: (decoded as any).id,
      "tokens.token": token
    });

    if (!user) throw new Error();

    res.locals.token = token;
    res.locals.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "please authenticate." });
  }
};

export default auth;
