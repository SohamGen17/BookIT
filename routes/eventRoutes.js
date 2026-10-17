
const express = require("express");
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .get(getEvents)
  .post(protect, adminOnly, createEvent);

router.route("/:id")
  .get(getEvent)
  .put(protect, adminOnly, updateEvent)
  .delete(protect, adminOnly, deleteEvent);

module.exports = router;
