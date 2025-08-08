import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req?.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access, no token provided");
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new ApiError(500, "Server misconfiguration: No JWT secret");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?.id) {
      throw new ApiError(401, "Token is invalid: No user ID found");
    }

    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    throw new ApiError(401, "Unauthorized access, invalid token");
  }
});

export default verifyJwt;
