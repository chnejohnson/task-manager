import express from "express";
import { createTask, getOwner } from "../controllers/task.controller";
import Task from "../models/task.model";

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

    updates.forEach(update => {
      task[update] = req.body[update];
    });

    task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default router;
