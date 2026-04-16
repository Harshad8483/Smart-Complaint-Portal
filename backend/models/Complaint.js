const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  userId: String,
  category: String,
  description: String,
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
