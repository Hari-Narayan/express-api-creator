import mongoose from "mongoose";

import { setJson, encryptPassword } from "../helpers/modelHelper.js";

const schema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    status: { type: Boolean, required: true, default: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: {
      type: String,
      required: false,
      set: encryptPassword,
    },
  },
  {
    toJSON: setJson,
    timestamps: true,
    versionKey: false,
    virtuals: { token: { type: String } },
  }
);

const User = mongoose.model("User", schema);

export default User;
