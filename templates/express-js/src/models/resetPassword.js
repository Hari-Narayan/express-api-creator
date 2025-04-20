const mongoose = require("mongoose");

const { setJson } = require("../utils/modelHelper");

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    token: { type: String, required: true },
    expiredAt: { type: Number, required: true },
    isUsed: { type: Boolean, required: true, default: false },
  },
  {
    toJSON: setJson,
    timestamps: false,
    versionKey: false,
  }
);

const ResetPassword = mongoose.model("reset-password", schema);

module.exports = ResetPassword;
