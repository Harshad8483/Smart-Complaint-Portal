const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/task6");

app.listen(3000, () => console.log("Server running on port 3000"));
