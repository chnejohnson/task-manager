import jwt from "jsonwebtoken";
import User from "../models/user.model";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisisprivatekey");
    const user = await User.findOne({ _id: decoded.id, "tokens.token": token });

    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "please authenticate." });
  }
};

export default auth;
