import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";
import * as process from "process";
import http from "http";

const PORT = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Crimson bot is active.\n");
  })
  .listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

dotenv.config();

let previousDate = new Date().toLocaleDateString("en-US", { day: "numeric" });
let previousDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

const agent = new AtpAgent({
  service: "https://bsky.social",
});

async function main() {
  await agent.login({
    identifier: process.env.BLUESKY_USERNAME!,
    password: process.env.BLUESKY_PASSWORD!,
  });
  console.log("Successfully logged in!");
}

async function checkForFriday13th() {
  let currentDate = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  let currentDay = new Date(currentDate).toLocaleDateString("en-US", {
    weekday: "long",
  });

  let currentDateNum = new Date(currentDate).toLocaleDateString("en-US", {
    day: "numeric",
  });

  if (previousDate !== currentDateNum || previousDay !== currentDay) {
    if (currentDateNum === "13" && currentDay === "Friday") {
      await agent.post({ text: "Today is Friday the 13th." });
      console.log("It's Friday the 13th!");
    } else {
      await agent.post({ text: "Today is not Friday the 13th." });
      console.log("It's not Friday the 13th.");
    }
    previousDate = currentDateNum;
    previousDay = currentDay;
  } else {
    console.log("It's the same day.");
  }
}

main();

setInterval(checkForFriday13th, 60 * 10 * 1000);
