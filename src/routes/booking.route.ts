import {
  createBooking,
  getAllBookings,
  getBookingById,
  getUpcomingBooking,
} from "../controller/booking.controller";
import { Router } from "express";

const bookingRouter = Router();
bookingRouter.post("/create", createBooking);
bookingRouter.get("/:userId", getAllBookings);
bookingRouter.get("/notification/:userId",getUpcomingBooking)
bookingRouter.get("/:id", getBookingById);

export default bookingRouter;
