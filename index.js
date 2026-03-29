const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();

// RAW BODY
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

const BOT_TOKEN = "ISI_BOT_TOKEN_KAMU";
const SIGNING_SECRET = "euaKbA93Qv6fNJdkvyYlpOfA6EVuAOhN";

// SIGNATURE CHECK
function isValidSignature(body, signature) {
    const hash = crypto
        .createHash("sha256")
        .update(Buffer.concat([body, Buffer.from(SIGNING_SECRET)]))
        .digest("hex");

    return hash === signature;
}

app.post("/webhook", async (req, res) => {
    const signature = req.headers["signature"];

    // VALIDATE SIGNATURE
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

    try {
        // PERSONAL
        if (body.event_type === "message_from_bot_subscriber") {
            const seatalk_id = body.event?.seatalk_id;

            if (seatalk_id) {
                const response = await axios.post(
                    "https://openapi.seatalk.io/open-apis/message/v2/send/",
                    {
                        receive_id: seatalk_id,
                        receive_id_type: "seatalk_id",
                        text: "Approved",
                        msg_type: "text"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${BOT_TOKEN}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log("✅ PERSONAL SENT:", response.data);
            }
        }

        // GROUP
        if (body.event_type === "new_mentioned_message_received_from_group_chat") {
            const group_id = body.event?.group_id;

            if (group_id) {
                const response = await axios.post(
                    "https://openapi.seatalk.io/open-apis/message/v2/send/",
                    {
                        receive_id: group_id,
                        receive_id_type: "group_id",
                        text: "Approved",
                        msg_type: "text"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${BOT_TOKEN}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log("✅ GROUP SENT:", response.data);
            }
        }

    } catch (err) {
        console.log("❌ SEND ERROR:", err.response?.data || err.message);
    }

    return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0");
