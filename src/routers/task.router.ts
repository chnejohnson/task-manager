import express from "express";
import { createTask, getOwner } from "../controllers/task.controller";

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

export default router;
