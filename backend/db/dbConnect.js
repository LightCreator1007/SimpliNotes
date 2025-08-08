import mongoose from "mongoose";

mongoose.connection.on("connected", () => {
  console.log("connection to database established");
});

mongoose.connection.on("error", () => {
  console.log("connection error");
});

mongoose.connection.on("disconnected", () => {
  console.log("database disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("database disconnected successfully due to app termination");
  process.exit(0);
});

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `successfully connected to database: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`failed to connect to database: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
