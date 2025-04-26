import jwt from "jsonwebtoken";

import User from "../models/user.js";

const auth = async (req, res, next) => {
  let token = req.headers.authorization || "";
  token = token ? token.replace("Bearer ", "") : "";

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: data.email });
    req.user = user;

    return next();
  } catch (error) {
    response = {
      data: null,
      status: 401,
      success: false,
      message: "You are unauthorized!",
    };
    return res.status(401).json(response);
  }
};

export default auth;
