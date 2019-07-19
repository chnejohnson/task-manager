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
const task_controller_1 = require("../controllers/task.controller");
const task_model_1 = __importDefault(require("../models/task.model"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post("/tasks", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const task = yield task_controller_1.createTask(Object.assign({}, req.body, { owner: res.locals.user._id }));
        if (!task)
            return res.status(400).send();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
// GET /tasks?completed=true
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === "true";
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    try {
        yield res.locals.user
            .populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
            .execPopulate();
        res.status(200).send(res.locals.user.tasks);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/tasks/:id", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const taskId = req.params.id;
    try {
        const task = yield task_model_1.default.findOne({
            _id: taskId,
            owner: res.locals.user._id
        }).populate("owner");
        if (!task)
            return res.status(404).send();
        res.send(task);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
router.patch("/tasks/:id", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdate = ["description", "completed"];
    const isValidOperation = updates.every(update => allowedUpdate.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates" });
    }
    try {
        const task = yield task_model_1.default.findOne({
            _id: req.params.id,
            owner: res.locals.user._id
        });
        if (!task)
            return res.status(404).send();
        updates.forEach(update => {
            task[update] = req.body[update];
        });
        yield task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
router.delete("/tasks/:id", auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const task = yield task_model_1.default.findOneAndDelete({
            _id: req.params.id,
            owner: res.locals.user._id
        });
        if (!task)
            return res.status(404).send();
        res.send(task);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
exports.default = router;
