import { compare } from "bcryptjs";

import User from "../models/user.js";
import { SOMETHING_WENT_WRONG } from "../lang/en/common.js";
import { USER_FOUND, USER_NOT_FOUND } from "../lang/en/user.js";
import {
  INCORRECT_PASSWORD,
  PASSWORD_CHANGED_SUCCESS,
} from "../lang/en/auth.js";

export async function myProfile(req, res, next) {
  try {
    return res.success({
      data: req.user,
      msg: USER_FOUND,
    });
  } catch (error) {
    next(error);
    // return res.json({
    //   error,
    //   status: 500,
    //   msg: SOMETHING_WENT_WRONG,
    // });
  }
}

export async function changePassword(req, res) {
  try {
    const { email, password, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        status: 404,
        msg: USER_NOT_FOUND,
        error: USER_NOT_FOUND,
      });
    }

    const isPassMatched = compare(password, user.password);

    if (!isPassMatched) {
      return res.json({
        status: 400,
        msg: INCORRECT_PASSWORD,
        error: INCORRECT_PASSWORD,
      });
    }

    await User.findOneAndUpdate(
      { _id: user.id },
      { $set: { password: newPassword } },
      { new: true }
    );

    return res.json({
      msg: PASSWORD_CHANGED_SUCCESS,
    });
  } catch (error) {
    return res.json({
      msg: SOMETHING_WENT_WRONG,
      status: 400,
      error,
    });
  }
}
