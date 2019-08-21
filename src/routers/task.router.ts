import express from "express";
import { createTask } from "../controllers/task.controller";
import Task from "../models/task.model";
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

// GET /tasks?completed=true
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const match: any = {};
  const sort: any = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await res.locals.user
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
    const task: any = await Task.findOne({
      _id: req.params.id,
      owner: res.locals.user._id
    });
    if (!task) return res.status(404).send();

    updates.forEach(update => {
      task[update] = req.body[update];
    });

    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e.message);
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
