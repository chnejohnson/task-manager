import express from "express";
import { createTask } from "../controllers/task.controller";
import Task, { ITask } from "../models/task.model";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = await createTask({ ...req.body, owner: res.locals.user._id });
    if (!task) return res.status(400).send();

    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks/me", auth, async (req, res) => {
  try {
    await res.locals.user.populate("tasks").execPopulate();
    res.status(200).send(res.locals.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOne({
      _id: taskId,
      owner: res.locals.user._id
    }).populate("owner");
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["description", "completed"];
  const isValidOperation = updates.every(update =>
    allowedUpdate.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: res.locals.user._id
    });
    if (!task) return res.status(404).send();

    // if (!isValidUpdates(updates)) throw new Error("Invalid updates type");

    updates.forEach(update => {
      task[update] = req.body[update];
    });

    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }

  function isValidUpdates(updates: string[]): updates is Array<keyof ITask> {
    return updates.every(isValidUpdate);
  }

  function isValidUpdate(update: string): update is keyof ITask {
    return update in Task;
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: res.locals.user._id
    });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
