const express = require("express");
const router =  express.Router();

const { getTask , createTask , updateTask , deleteTask , importTask} = require("../controllers/taskController");

router.get("/", getTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.post("/import", importTask);

module.exports = router;