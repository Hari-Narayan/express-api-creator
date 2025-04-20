const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const {
  setJson,
  createFileURL,
  encryptPassword,
} = require("../utils/modelHelper");

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
    profileImage: {
      type: String,
      required: false,
      get: (value) => createFileURL(value, "users"),
    },
  },
  {
    toJSON: setJson,
    timestamps: true,
    versionKey: false,
    virtuals: { token: { type: String } },
  }
).plugin(mongoosePaginate);

const User = mongoose.model("User", schema);

module.exports = User;
