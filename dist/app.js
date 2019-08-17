"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./connect.js");
const mongoose_1 = __importDefault(require("mongoose"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const task_router_1 = __importDefault(require("./routers/task.router"));
// import cors from "./middleware/cors";
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
mongoose_1.default.set("useFindAndModify", false);
app.use(cors_1.default());
app.use(user_router_1.default);
app.use(task_router_1.default);
exports.default = app;
