import app from "./app.js";
import connectDb from "./config/db.js";
import { env } from "./config/env.js";


connectDb();

app.listen(env.PORT,() => {
  console.log("Server is Listening...");
});