import {
  createBooking,
  getAllBookings,
  getBookingById,
  getUpcomingBooking,
  getAllUpcoming,
  updateBookingStatus,
  deleteBooking,
  updateStatusByTime,
} from "../controller/booking.controller";
import { Router } from "express";

const bookingRouter = Router();
bookingRouter.post("/create", createBooking);
bookingRouter.get("/:userId", getAllBookings);
bookingRouter.get("/notification/:userId",getUpcomingBooking)
bookingRouter.get("/:id", getBookingById);
bookingRouter.get("/upcome/:userId",getAllUpcoming)
bookingRouter.put("/update/status/:bookingId",updateBookingStatus)
bookingRouter.delete("/:bookingId",deleteBooking)
bookingRouter.put('/expire/:bookingId',updateStatusByTime)


export default bookingRouter;
