import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

//register user

const registerUser = async (res, req) => {
  //get all details from the user
  //store in the database
  const { username, email, password, avatar } = req.body;
};
