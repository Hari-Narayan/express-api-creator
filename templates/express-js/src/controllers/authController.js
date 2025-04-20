const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const mailer = require("../utils/mailer");
const ResetPassword = require("../models/resetPassword");
// const mailer = require("../helpers/mailer");
// const ResetPassword = require("../models/resetPassword");
// const { randomString } = require("../helpers/commonHelper");
// const { successResponse, res.errorResponse } = require("../helpers/apiResponse");
const {
  SOMETHING_WENT_WRONG,
  YOU_ARE_LOGGED_IN_SUCCESSFULLY,
} = require("../lang/en/common");
const {
  USER_NOT_FOUND,
  RESET_LINK_EXPIRED,
  USER_ALREADY_EXIST,
  INCORRECT_PASSWORD_ERR,
  RESET_PASSWORD_SUCCESSFULLY,
  RESET_LINK_SENT_SUCCESSFULLY,
  PASSWORD_CHANGED_SUCCESSFULLY,
} = require("../lang/en/user");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user)
      return res.errorResponse({
        status: 404,
        msg: USER_NOT_FOUND,
        error: USER_NOT_FOUND,
      });

    const isPassMatched = bcrypt.compareSync(password, user.password);

    if (!isPassMatched)
      return res.errorResponse({
        status: 400,
        msg: INCORRECT_PASSWORD_ERR,
        error: INCORRECT_PASSWORD_ERR,
      });

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    user.token = token;

    return res.successResponse({
      data: user,
      msg: YOU_ARE_LOGGED_IN_SUCCESSFULLY,
    });
  } catch (error) {
    return res.errorResponse({
      error,
      status: 500,
      msg: SOMETHING_WENT_WRONG,
    });
  }
};

exports.register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user)
      return res.errorResponse({
        status: 400,
        msg: USER_ALREADY_EXIST,
        error: USER_ALREADY_EXIST,
      });

    user = await new User(req.body).save();

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    user.token = token;

    return res.successResponse({
      data: user,
      msg: YOU_ARE_LOGGED_IN_SUCCESSFULLY,
    });
  } catch (error) {
    return res.errorResponse({
      error,
      status: 400,
      msg: SOMETHING_WENT_WRONG,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;
    const user = await User.findOne({ email });
    const isPassMatched = await bcrypt.compare(password, user.password);

    if (!isPassMatched) {
      return res.errorResponse({
        msg: INCORRECT_PASSWORD_ERR,
        status: 400,
        error: INCORRECT_PASSWORD_ERR,
      });
    }

    await User.findOneAndUpdate(
      { _id: user.id },
      { $set: { password: newPassword } },
      { new: true }
    );

    return res.successResponse({
      msg: PASSWORD_CHANGED_SUCCESSFULLY,
    });
  } catch (error) {
    return res.errorResponse({
      msg: SOMETHING_WENT_WRONG,
      status: 400,
      error,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (!user)
      return res.errorResponse({
        msg: USER_NOT_FOUND,
        status: 404,
        error: USER_NOT_FOUND,
      });

    const reset = await new ResetPassword({
      email,
      token: randomString(60),
      expiredAt: new Date().getTime() + 1000 * 60 * 60,
    }).save();

    await mailer({
      to: email,
      subject: "Reset Password",
      html: `<a href="${process.env.AUTH_BASE_URL}/reset/${reset.token}" target="_blank">Click here to reset password</a>`,
    });

    return res.successResponse({
      msg: RESET_LINK_SENT_SUCCESSFULLY,
      data: reset,
    });
  } catch (error) {
    return res.errorResponse({
      msg: SOMETHING_WENT_WRONG,
      status: 400,
      error,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    console.log({ body: req.body });

    const resetPassword = await ResetPassword.findOne({ token });
    const { email, expiredAt } = resetPassword;
    const now = new Date().getTime();

    if (now > expiredAt)
      return res.errorResponse({
        status: 400,
        msg: RESET_LINK_EXPIRED,
        error: RESET_LINK_EXPIRED,
      });

    if (newPassword !== confirmPassword)
      return res.errorResponse({
        status: 400,
        msg: "Password & Confirm password does not match!",
        // error: RESET_LINK_EXPIRED,
      });

    await User.findOneAndUpdate(
      { email },
      { $set: { password: newPassword } },
      { new: true }
    );

    await ResetPassword.deleteOne({ token });

    return res.successResponse({
      // data:"Y",
      msg: RESET_PASSWORD_SUCCESSFULLY,
    });
  } catch (error) {
    return res.errorResponse({
      msg: SOMETHING_WENT_WRONG,
      status: 400,
      error,
    });
  }
};

exports.resetTokenPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const resetPassword = await ResetPassword.findOne({ token });
    const now = new Date().getTime();

    console.log(resetPassword);

    if (!resetPassword)
      return res.render("token", {
        msg: "Token not found!",
        title: "Reset Password",
        header: "Token Expired",
      });

    if (now > resetPassword.expiredAt)
      return res.render("token", {
        msg: RESET_LINK_EXPIRED,
        title: "Reset Password",
        header: "Token Expired",
      });

    return res.render("reset-password", {
      token,
      title: "Reset Password",
      header: "Reset Your Password",
    });
  } catch (error) {
    return res.errorResponse({
      error,
      status: 400,
      msg: SOMETHING_WENT_WRONG,
    });
  }
};
