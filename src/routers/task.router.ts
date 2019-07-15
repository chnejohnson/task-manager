import express from "express";
import { createTask, getOwner } from "../controllers/task.controller";
import Task, { ITask } from "../models/task.model";

const router = express.Router();

router.post("/task", async (req, res) => {
  try {
    const task = await createTask(req.body);
    if (!task) return res.status(400).send();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/task/:id", async (req, res) => {
  try {
    const task = await getOwner(req.params.id).populate("owner");
    if (!task) return res.status(400).send();

    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/task/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["description", "completed"];
  const isValidOperation = updates.every(update =>
    allowedUpdate.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(400).send({ error: "Invalid id" });

    if (!isValidUpdates(updates)) throw new Error("Invalid updates type");

    updates.forEach(update => {
      task[update] = req.body[update];
    });

    task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }

  function isValidUpdates(updates: string[]): updates is Array<keyof ITask> {
    return updates.every(isValidUpdate);
  }

  function isValidUpdate(update: string): update is keyof ITask {
    return update in Task;
  }
});

export default router;
