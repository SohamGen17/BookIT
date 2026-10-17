
const Event = require("../models/Event");

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, venue, totalSeats } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !date ||
      !venue?.trim() ||
      totalSeats === undefined ||
      totalSeats === null ||
      totalSeats === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "All event fields are required",
      });
    }

    if (isNaN(Date.parse(date)) || new Date(date) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Event date must be in the future",
      });
    }

    if (!Number.isInteger(Number(totalSeats)) || Number(totalSeats) < 1) {
      return res.status(400).json({
        success: false,
        message: "Total seats must be a positive integer",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      totalSeats: Number(totalSeats),
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const filter = { date: { $gt: new Date() } };

    if (req.query.search?.trim()) {
      filter.title = {
        $regex: req.query.search.trim(),
        $options: "i",
      };
    }

    if (req.query.venue?.trim()) {
      filter.venue = {
        $regex: req.query.venue.trim(),
        $options: "i",
      };
    }

    const events = await Event.find(filter).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { title, description, date, venue, totalSeats, bookedSeats } =
      req.body;

    if (
      (date !== undefined &&
        (isNaN(Date.parse(date)) || new Date(date) <= new Date())) ||
      (totalSeats !== undefined &&
        (!Number.isInteger(Number(totalSeats)) || Number(totalSeats) < 1)) ||
      (bookedSeats !== undefined &&
        (!Number.isInteger(Number(bookedSeats)) || Number(bookedSeats) < 0))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date or seat count",
      });
    }

    if (
      totalSeats !== undefined &&
      bookedSeats === undefined
    ) {
      const existing = await Event.findById(req.params.id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      if (Number(totalSeats) < existing.bookedSeats) {
        return res.status(400).json({
          success: false,
          message: "Total seats cannot be less than booked seats",
        });
      }
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (date !== undefined) updates.date = date;
    if (venue !== undefined) updates.venue = venue;
    if (totalSeats !== undefined) updates.totalSeats = Number(totalSeats);
    if (bookedSeats !== undefined) updates.bookedSeats = Number(bookedSeats);

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.bookedSeats > event.totalSeats) {
      return res.status(400).json({
        success: false,
        message: "Total seats cannot be less than booked seats",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.bookedSeats > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an event with existing bookings",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
