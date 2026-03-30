const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();

// RAW BODY (buat signature)
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// ❗ GANTI INI
const BOT_TOKEN = "ISI_BOT_TOKEN_KAMU";
const SIGNING_SECRET = "euaKbA93Qv6fNJdkvyYlpOfA6EVuAOhN";

// VALIDASI SIGNATURE
function isValidSignature(body, signature) {
  const hash = crypto
    .createHash("sha256")
    .update(Buffer.concat([body, Buffer.from(SIGNING_SECRET)]))
    .digest("hex");

  return hash === signature;
}

app.post("/webhook", async (req, res) => {
  const signature = req.headers["signature"];

  if (!isValidSignature(req.rawBody, signature)) {
    console.log("❌ INVALID SIGNATURE");
    return res.sendStatus(403);
  }

  const body = req.body;
  console.log("FULL EVENT:", JSON.stringify(body));

  // VERIFICATION
  if (body.event_type === "event_verification") {
    return res.status(200).json(body.event);
  }

  let target_id = null;
  let target_type = null;

  // PERSONAL
  if (body.event_type === "message_from_bot_subscriber") {
    target_id = body.event?.seatalk_id;
    target_type = "seatalk_id";
  }

  // GROUP
  if (body.event_type === "new_mentioned_message_received_from_group_chat") {
    target_id = body.event?.group_id;
    target_type = "group_id";
  }

  // KIRIM MESSAGE
  if (target_id) {
    try {
      await axios.post(
        "https://openapi.seatalk.io/open-apis/message/v2/send",
        {
          receive_id: target_id,
          receive_id_type: target_type,
          msg_type: "text",
          content: JSON.stringify({
            text: "Approved"
          })
        },
        {
          headers: {
            Authorization: `Bot ${BOT_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ SENT SUCCESS");
    } catch (err) {
      console.log("❌ SEND ERROR:", err.response?.data || err.message);
    }
  }

  return res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("Server running...");
});
