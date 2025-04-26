import jwt from "jsonwebtoken";
import { compareSync } from "bcryptjs";

import User from "../models/user.js";
import mailer from "../helpers/mailerHelper.js";
import { USER_NOT_FOUND } from "../lang/en/user.js";
import CommonHelper from "../helpers/commonHelper.js";
import ResetPassword from "../models/resetPassword.js";
import ResponseHelper from "../helpers/responseHelper.js";
import { SOMETHING_WENT_WRONG } from "../lang/en/common.js";
import {
  LOGIN_SUCCESS,
  INCORRECT_PASSWORD,
  USER_ALREADY_EXIST,
  RESET_LINK_EXPIRED,
  RESET_LINK_SENT_SUCCESS,
  PASSWORD_CHANGED_SUCCESS,
} from "../lang/en/auth.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user)
      return ResponseHelper.error({
        res,
        statusCode: 404,
        error: USER_NOT_FOUND,
        message: USER_NOT_FOUND,
      });

    const isPassMatched = compareSync(password, user.password);

    if (!isPassMatched)
      return ResponseHelper.error({
        res,
        statusCode: 400,
        error: INCORRECT_PASSWORD,
        message: INCORRECT_PASSWORD,
      });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    user.token = token;

    return ResponseHelper.success({
      res,
      data: user,
      statusCode: 200,
      msg: LOGIN_SUCCESS,
    });
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
    });
  }
}

export async function register(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user)
      return res.json({
        status: 400,
        msg: USER_ALREADY_EXIST,
        error: USER_ALREADY_EXIST,
      });

    user = await new User(req.body).save();

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    user.token = token;

    return ResponseHelper.success({
      res,
      data: user,
      statusCode: 201,
      message: LOGIN_SUCCESS,
    });
  } catch (error) {
    console.error(error);

    return res.json({
      error: JSON.stringify(error),
      status: 400,
      msg: SOMETHING_WENT_WRONG,
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.json({
        status: 404,
        msg: USER_NOT_FOUND,
        error: USER_NOT_FOUND,
      });

    await ResetPassword.findOneAndDelete({ email });

    let resetUser = await new ResetPassword({
      email,
      token: CommonHelper.randomString(60),
      expiredAt: new Date().getTime() + 1000 * 60 * 60,
    }).save();

    await mailer({
      to: email,
      subject: "Reset Password",
      html: `<a href="${process.env.RESET_URL.replace(
        "token",
        resetUser.token
      )}" target="_blank">Click here to reset password</a>`,
    });

    return res.json({
      data: resetUser,
      msg: RESET_LINK_SENT_SUCCESS,
    });
  } catch (error) {
    console.error(error);

    return res.json({
      msg: SOMETHING_WENT_WRONG,
      status: 400,
      error,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    const resetPassword = await ResetPassword.findOne({ token });
    const { email, expiredAt } = resetPassword;
    const now = new Date().getTime();

    if (now > expiredAt)
      return res.json({
        status: 400,
        msg: RESET_LINK_EXPIRED,
        error: RESET_LINK_EXPIRED,
      });

    if (newPassword !== confirmPassword)
      return res.json({
        status: 400,
        msg: "Password & Confirm password does not match!",
        // error: RESET_LINK_EXPIRED,
      });

    await User.findOneAndUpdate(
      { email },
      { $set: { password: newPassword } },
      { new: true }
    );

    await deleteOne({ token });

    return res.json({
      // data:"Y",
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
