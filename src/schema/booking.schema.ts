import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  tokenId: string;
  service:string;
  status: string;
  timeSlot: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
  queuePosition?: number;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tokenId: {
      type: String,
      required: true,
      unique: true,
    },
    service: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    timeSlot: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    queuePosition: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = model<IBooking>('Booking', bookingSchema);

export default BookingModel;
