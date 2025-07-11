import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      minlength: 6,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
