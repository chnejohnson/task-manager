"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_model_1 = __importDefault(require("../models/task.model"));
function createTask({ owner, description, completed }) {
    return task_model_1.default.create({ owner, description, completed });
}
exports.createTask = createTask;
