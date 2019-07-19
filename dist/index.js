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
const app = express_1.default();
const port = process.env.PORT;
mongoose_1.default.set("useFindAndModify", false);
app.use(user_router_1.default);
app.use(task_router_1.default);
app.listen(port, () => {
    console.log(`Server listen up on port ${port}`);
});
