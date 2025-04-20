const moment = require("moment");
const bcrypt = require("bcryptjs");

exports.createFileURL = (image, folder) => {
  return image ? `${process.env.BASE_URL}/${folder}/${image}` : null;
};

exports.setJson = {
  getters: true,
  transform: (doc, res) => {
    delete res._id;
    delete res.password;

    res.createdAt = moment(res.createdAt).format("YYYY-MM-DD HH:mm:ss");
    res.updatedAt = moment(res.updatedAt).format("YYYY-MM-DD HH:mm:ss");
  },
};

exports.encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};
