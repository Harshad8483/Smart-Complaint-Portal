const router = require("express").Router();
const Complaint = require("../models/Complaint");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  res.json(await Complaint.find({ userId: req.user.id }));
});

router.post("/", auth, async (req, res) => {
  const complaint = new Complaint({
    userId: req.user.id,
    category: req.body.category,
    description: req.body.description
  });
  await complaint.save();
  res.json(complaint);
});

router.delete("/:id", auth, async (req, res) => {
  await Complaint.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

module.exports = router;
