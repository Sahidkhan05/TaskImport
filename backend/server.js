require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const taskRoutes = require("./routes/taskRoute");


const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongodb connected"))
.catch((err) => console.log(err));

app.use("/api/tasks",taskRoutes);

app.get("/", (req,res) => {
    res.send("Server is running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});