
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { eventId, seats } = req.body;
    const seatCount = Number(seats);

    if (
      !eventId ||
      !mongoose.isValidObjectId(eventId) ||
      !Number.isInteger(seatCount) ||
      seatCount < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid event ID and a positive integer seat count",
      });
    }

    let booking;

    await session.withTransaction(async () => {
      const event = await Event.findOneAndUpdate(
        {
          _id: eventId,
          date: { $gt: new Date() },
          $expr: {
            $lte: [
              { $add: ["$bookedSeats", seatCount] },
              "$totalSeats",
            ],
          },
        },
        { $inc: { bookedSeats: seatCount } },
        { new: true, session }
      );

      if (!event) {
        const existingEvent = await Event.findById(eventId).session(session);

        if (!existingEvent) {
          const error = new Error("Event not found");
          error.statusCode = 404;
          throw error;
        }

        if (existingEvent.date <= new Date()) {
          const error = new Error("Cannot book a past event");
          error.statusCode = 400;
          throw error;
        }

        const available = existingEvent.totalSeats - existingEvent.bookedSeats;
        const error = new Error(
          `Only ${available} seats are left for this event`
        );
        error.statusCode = 400;
        throw error;
      }

      [booking] = await Booking.create(
        [
          {
            user: req.user.id,
            event: event._id,
            seats: seatCount,
          },
        ],
        { session }
      );
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    await session.withTransaction(async () => {
      const booking = await Booking.findById(req.params.id).session(session);

      if (!booking) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
      }

      if (booking.user.toString() !== req.user.id) {
        const error = new Error("You are not allowed to cancel this booking");
        error.statusCode = 403;
        throw error;
      }

      if (booking.status === "cancelled") {
        const error = new Error("Booking is already cancelled");
        error.statusCode = 400;
        throw error;
      }

      const event = await Event.findByIdAndUpdate(
        booking.event,
        { $inc: { bookedSeats: -booking.seats } },
        { new: true, session }
      );

      if (!event) {
        const error = new Error("Event not found");
        error.statusCode = 404;
        throw error;
      }

      booking.status = "cancelled";
      await booking.save({ session });
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };
