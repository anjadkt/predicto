import app from "./app.js";
import connectDb from "./config/db.js";
import { env } from "./config/env.js";
import { syncMatches } from "./controller/match.controller.js";

connectDb();

app.listen(env.PORT, () => {
  console.log(`Server is Listening on port ${env.PORT}`);
  syncMatches();
  console.log("syncing started")
});