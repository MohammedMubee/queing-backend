import BookingModel from "../schema/booking.schema";

import { Request, Response } from "express";
import moment from "moment";

import { IBooking } from "../schema/booking.schema";
import mongoose from "mongoose";
export const createBooking = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "createBooking");
    const { userId, tokenId, service, status, timeSlot, date } = req.body;

    if (!tokenId || !service || !timeSlot || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // based on given services it need count queue position from the today's date
    const today = new Date();
    const bookingsToday = await BookingModel.find({
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999)),
      },
      service,
    });

    const newBooking = new BookingModel({
      userId,
      tokenId,
      service,
      status,
      timeSlot,
      date,
      queuePosition: bookingsToday.length + 1,
    });

    await newBooking.save();
    console.log(newBooking, "newBooking");

    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;

    const booking = await BookingModel.findById(bookingId).populate("userId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  console.log(req.params);
  try {
    console.log(req.params);

    const { userId } = req.params;

    const bookings = await BookingModel.find({ userId }).populate("userId");
    console.log(bookings);
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUpcomingBooking = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const currentDate = moment().format("YYYY-MM-DD");
  const currentTime = moment().format("hh:mm A");

  try {
    const upcomingBooking = await BookingModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: { $in: ["pending", "confirmed"] },
          $expr: {
            $or: [
              { $gt: ["$date", new Date()] },
              {
                $and: [
                  {
                    $eq: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                      currentDate,
                    ],
                  },
                  { $gt: ["$timeSlot", currentTime] },
                ],
              },
            ],
          },
        },
      },
      { $sort: { date: 1, timeSlot: 1 } },
      { $limit: 1 },
    ]);

    if (upcomingBooking.length === 0) {
      return res.status(404).json({ message: "No upcoming bookings found." });
    }

    res.json(upcomingBooking[0]);
  } catch (error) {
    console.error("Error fetching upcoming booking:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllUpcoming = async (req: Request, res: Response) => {
  // dont need exiting datas
  const currentDate = moment().format("YYYY-MM-DD");
  const currentTime = moment().format("hh:mm A");
  try {
    const { userId } = req.params;
    const upcomingBooking = await BookingModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: { $in: ["pending", "confirmed"] },
          $expr: {
            $or: [
              { $gt: ["$date", new Date()] },
              {
                $and: [
                  {
                    $eq: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                      currentDate,
                    ],
                  },
                  { $gt: ["$timeSlot", currentTime] },
                ],
              },
            ],
          },
        },
      },
    
    ]);
    
    if (upcomingBooking.length === 0) {
      return res.status(404).json({ message: "No upcoming bookings found." });
    }

    res.json({ data: upcomingBooking, messeage: "retrive succesfully" });
  } catch (error) {
    console.error("Error fetching upcoming booking:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({
      message: "Status updated successfully.",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  console.log('dellet')
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: "Invalid booking ID." });
  }

  try {
    const deletedBooking = await BookingModel.findByIdAndDelete(bookingId);
   console.log(deleteBooking)
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({ message: "Booking deleted successfully." });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const updateStatusByTime = async (req: Request, res: Response) => {
  console.log("🔥 Expire API hit", req.params.bookingId);

  try {
    const { bookingId } = req.params;
    console.log(bookingId,'updatebooking')

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const bookingDate = moment(booking.date).format("YYYY-MM-DD");
    const bookingTime = moment(booking.timeSlot, "hh:mm A");
    const nowDate = moment().format("YYYY-MM-DD");
    const nowTime = moment();

    const isExpired =
      moment(nowDate).isAfter(bookingDate) ||
      (nowDate === bookingDate );

    if (isExpired && booking.status !== "expired") {
      booking.status = "expired";
      await booking.save();
      return res.status(200).json({ message: "Booking marked as expired.", data: booking });
    }
    console.log(booking,'updatebooking')
    return res.status(200).json({ message: "Booking is not expired.", data: booking });
  } catch (error) {
    console.error("Error checking booking expiration:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
