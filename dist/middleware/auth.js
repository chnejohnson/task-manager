"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jwtPrivateKey = process.env.JWT_SECRET;
const auth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        let token = req.header("Authorization");
        if (!token)
            throw new Error();
        token = token.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, jwtPrivateKey);
        const user = yield user_model_1.default.findOne({
            _id: decoded.id,
            "tokens.token": token
        });
        if (!user)
            throw new Error();
        res.locals.token = token;
        res.locals.user = user;
        next();
    }
    catch (e) {
        res.status(401).send({ error: "please authenticate." });
    }
});
exports.default = auth;
