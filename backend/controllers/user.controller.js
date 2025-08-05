import { access } from "fs";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Error generating tokens");
  }
};

//register user

const registerUser = asyncHandler(async (res, req) => {
  //get all details from the user
  const { username, email, password } = req.body;
  //check to see if any field is empty
  if ([username, email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  //check to see if the user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  //get avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required");
  }
  //upload avatar on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "upload to cloudinary failed");
  }
  const user = await User.create({
    username,
    avatar: avatar.url,
    password,
    email,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(400, "Failed to create user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Created User Successfully"));
});

//log in user
const login = asyncHandler(async (res, req) => {
  const { email, username, password } = req.body;
  if (!username & !email) {
    throw new ApiError(400, "username and emailId is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(404, "Invalid Password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        refreshToken,
        accessToken,
      })
    );
});

//log out user
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ApiError(400, "No refresh token found");
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "user already logged out"));
  }
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

//renew session
const renewSession = asyncHandler(async (req, res) => {});

// modify user avatar

const changeAvatar = asyncHandler(async (res, req) => {});

// modify user details

//change password
