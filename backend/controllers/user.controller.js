import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

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

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ([username, email, password].some((fields) => fields.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
      console.log("fucked up");

      throw new ApiError(400, "avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
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
      .json(new ApiResponse(201, createdUser, "Created User Successfully"));
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

//log in user
const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
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
const renewSession = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const incomingRefreshToken = refreshToken;
  if (!incomingRefreshToken) {
    console.log("Refresh token not found");
    throw new ApiError(400, "No refresh token found");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
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
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Session renewed successfully"
        )
      );
  } catch (err) {
    console.log(err);
    throw new ApiError(401, "error renewing session");
  }
});

// modify user avatar

const changeAvatar = asyncHandler(async (req, res) => {
  try {
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
      throw new ApiError(500, "Failed to upload on cloudinary");
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { avatar: avatar.url },
      },
      { new: true }
    ).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Avatar updated successfully"));
  } catch (error) {
    throw new ApiError(400, "error changing avatar");
  }
});

// modify user details
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      throw new ApiError(400, "Username and email are required");
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
      $set: { username, email },
    }).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, user, "user data updated successfuly"));
  } catch (error) {
    throw new ApiError(400, "user updation failed");
  }
});

//change password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }
  user.password = newPassword;
  user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed sucessfully"));
});

//get current user
const getUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, ""));
});

export {
  registerUser,
  login,
  logout,
  renewSession,
  changeAvatar,
  getUser,
  changePassword,
  updateUser,
};
