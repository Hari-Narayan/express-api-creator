import { Schema, model } from "mongoose";

import { setJson } from "../helpers/modelHelper.js";

const schema = new Schema(
  {
    email: { type: String, required: true, trim: true },
    token: { type: String, required: true },
    expiredAt: { type: Number, required: true },
  },
  {
    toJSON: setJson,
    timestamps: false,
    versionKey: false,
  }
);

const ResetPassword = model("reset-password", schema);

export default ResetPassword;
