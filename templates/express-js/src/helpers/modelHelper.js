import moment from "moment";
import { genSaltSync, hashSync } from "bcryptjs";

export const setJson = {
  getters: true,
  transform: (doc, res) => {
    delete res._id;
    delete res.password;

    res.createdAt = moment(res.createdAt).format("YYYY-MM-DD HH:mm:ss");
    res.updatedAt = moment(res.updatedAt).format("YYYY-MM-DD HH:mm:ss");
  },
};

export function encryptPassword(password) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
}
