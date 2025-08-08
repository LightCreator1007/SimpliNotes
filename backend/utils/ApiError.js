// This file defines custom error handling for my proj

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    error = [],
    stack = ""
  ) {
    super(message); // call the parent constructor and initializes other stuff too
    this.statusCode = statusCode;
    this.error = error;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // sets the stack trace for the error while omitting the current constructor, i.e ApiError
    }
  }
}

export default ApiError;
