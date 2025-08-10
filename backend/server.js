import "./config.js";
import connectDb from "./db/dbConnect.js";
import app from "./app.js";
import mongoose from "mongoose";

let server;

//connect databse and then start the server
(async () => {
  try {
    await connectDb();
    const port = process.env.PORT || 8000;
    server = app.listen(port, () => {
      console.log(`server listening on port: ${port}`);
    });
  } catch (error) {
    console.log("Connection failed", error);
    process.exit(1);
  }
})();

//gracefully close server along with the database
process.on("SIGINT", async () => {
  console.log("\nrecieved SIGINT, shutting down.....");
  if (server) await server.close(() => console.log("server shut down"));
  await mongoose.connection.close();
  process.exit(0);
});
