import BookingModel from "../schema/booking.schema";

import { Request, Response } from "express";
import moment from 'moment';

import { IBooking } from "../schema/booking.schema";
import mongoose from "mongoose";
export const createBooking = async (req: Request, res: Response) => {
  try {
    console.log(req.body,'createBooking')
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
        console.log(newBooking,'newBooking')

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
  console.log(req.params)
  try {
      console.log(req.params)

        const { userId } = req.params;

    const bookings = await BookingModel.find({userId}).populate("userId");
    console.log(bookings)
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUpcomingBooking = async (req: Request, res: Response)=>{
   const { userId } = req.params;


  const currentDate = moment().format('YYYY-MM-DD');     
  const currentTime = moment().format('hh:mm A');        

  try {
    const upcomingBooking = await BookingModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: { $in: ['pending', 'confirmed'] },
          $expr: {
            $or: [
              { $gt: ['$date', new Date()] },
              {
                $and: [
                  {
                    $eq: [
                      { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                      currentDate,
                    ],
                  },
                  { $gt: ['$timeSlot', currentTime] },
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
      return res.status(404).json({ message: 'No upcoming bookings found.' });
    }

    res.json(upcomingBooking[0]);
  } catch (error) {
    console.error('Error fetching upcoming booking:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAllUpcoming =async(req:Request,res:Response)=>{
  

}
