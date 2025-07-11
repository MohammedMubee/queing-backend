import {
  createBooking,
  getAllBookings,
  getBookingById,
  getUpcomingBooking,
  getAllUpcoming
} from "../controller/booking.controller";
import { Router } from "express";

const bookingRouter = Router();
bookingRouter.post("/create", createBooking);
bookingRouter.get("/:userId", getAllBookings);
bookingRouter.get("/notification/:userId",getUpcomingBooking)
bookingRouter.get("/:id", getBookingById);
bookingRouter.get("/upcome/:userId",getAllUpcoming)

export default bookingRouter;
