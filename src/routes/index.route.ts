import userRouter from "./user.route";
import bookingRouter from "./booking.route";
import { Router } from "express";


const router = Router();
router.use("/user", userRouter);
router.use("/booking", bookingRouter);

export default router;