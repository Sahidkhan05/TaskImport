const streams = require("stream");
const csv = require("csv-parser");
const { default: axios } = require("axios");
const Task = require("../models/Task");

exports.getTask = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      completed: false,
    });

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    res.json({ message: " Task Succesfully Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.importTask = async (req, res) => {
  try {
    const { sheetUrl } = req.body;

    if (!sheetUrl || !sheetUrl.includes("docs.google.com")) {
      return res.status(400).json({ message: "Invalid google sheet url" });
    }

    const sheetId = sheetUrl.split("/d/")[1]?.split("/")[0];

    if (!sheetId) {
      return res.status(400).json({ message: "Invalid sheet url format" });
    }

    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    const response = await axios.get(csvUrl);

    const readable = new streams.Readable();
    readable.push(response.data);
    readable.push(null);

    const results = [];

    await new Promise((resolve, reject) => {
      readable
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    // ✅ SAFE + FLEXIBLE MAPPING
    const tasks = results
  .map((row) => {
    const r = {};
    Object.keys(row).forEach((key) => {
      r[key.trim()] = row[key];
    });

    const title = r.title || r.Title;
    const description = r.description || r.Description || "";
    const dueDateRaw = r.dueDate || r["Due Date"];
    const completedRaw = r.completed || r.Completed;

    return {
      title: title?.trim(),
      description,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      completed:
        completedRaw === "TRUE" ||
        completedRaw === true ||
        false,
    };
  })
  .filter((task) => task.title);

    // ✅ OPTIMIZED DUPLICATE CHECK
    const existingTasks = await Task.find({
      title: { $in: tasks.map((t) => t.title) },
    });

    const existingTitles = new Set(existingTasks.map((t) => t.title));

    const filteredTasks = tasks.filter(
      (task) => !existingTitles.has(task.title)
    );

    await Task.insertMany(filteredTasks);

    res.json({
      message: "Tasks imported successfully",
      total: tasks.length,
      inserted: filteredTasks.length,
      skipped: tasks.length - filteredTasks.length,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};