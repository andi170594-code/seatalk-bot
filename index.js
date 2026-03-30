const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "ISI_BOT_TOKEN_KAMU";

app.post("/webhook", async (req, res) => {
    const body = req.body;

    console.log("FULL EVENT:", JSON.stringify(body));

    if (body.event_type === "event_verification") {
        return res.status(200).json(body.event);
    }

    let target_id = null;
    let target_type = null;

    if (body.event_type === "message_from_bot_subscriber") {
        target_id = body.event?.seatalk_id;
        target_type = "seatalk_id";
    }

    if (body.event_type === "new_mentioned_message_received_from_group_chat") {
        target_id = body.event?.group_id;
        target_type = "group_id";
    }

    if (target_id) {
        try {
            await axios.post(
                "https://openapi.seatalk.io/messaging/v2/send_message",
                {
                    receive_id: target_id,
                    receive_id_type: target_type,
                    msg_type: "text",
                    content: {
                        text: "Approved"
                    }
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

app.listen(process.env.PORT || 3000, "0.0.0.0");
