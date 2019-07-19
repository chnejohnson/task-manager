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
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_1 = __importDefault(require("../middleware/auth"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const account_1 = require("../emails/account");
const router = express_1.default.Router();
//let "req.body" be a json format, such as body-parser.
router.use(express_1.default.json());
//sign up
router.post("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const user = new user_model_1.default(req.body);
    try {
        yield user.save();
        const token = yield user.generateAuthToken();
        account_1.sendWelcomeEmail(user.email, user.name);
        res.status(201).send({ user, token });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
//Login
router.post("/users/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByCredentials(req.body.email, req.body.password);
        const token = yield user.generateAuthToken();
        res.send({ user, token });
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
//Logout
router.post("/users/logout", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.locals.user.tokens = res.locals.user.tokens.filter((token) => {
            return token.token !== res.locals.token;
        });
        yield res.locals.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
//Logout all
router.post("/users/logoutAll", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.locals.user.tokens = [];
        yield res.locals.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
//Read profile
router.get("/users/me", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(res.locals.user);
}));
//Update profile
router.patch("/users/me", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation)
        return res.status(400).send({ error: "Invalid updates" });
    try {
        const user = res.locals.user;
        updates.forEach(update => {
            user[update] = req.body[update];
        });
        yield user.save();
        res.send(user).status(201);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
//Delete profile
router.delete("/users/me", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield res.locals.user.remove();
        account_1.sendCancelationEmail(res.locals.user.email, res.locals.user.name);
        res.send(res.locals.user);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
//Multer settings
const upload = multer_1.default({
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
router.post("/users/me/avatar", auth_1.default, upload.single("avatar"), (req, res) => __awaiter(this, void 0, void 0, function* () {
    const buffer = yield sharp_1.default(req.file.buffer)
        .resize(250, 250)
        .png()
        .toBuffer();
    res.locals.user.avatar = buffer;
    yield res.locals.user.save();
    res.send();
}), (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});
//Delete avatar
router.delete("/users/me/avatar", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.locals.user.avatar = undefined;
    yield res.locals.user.save();
    res.send();
}));
//Get avatar
router.get("/users/:id/avatar", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error("Can't find the user or user's avatar.");
        }
        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
}));
exports.default = router;
