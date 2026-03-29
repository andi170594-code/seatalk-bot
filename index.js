const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "ISI_BOT_TOKEN_KAMU";

app.post("/webhook", async (req, res) => {
    const body = req.body;

    console.log("FULL EVENT:", JSON.stringify(body));

    // ✅ VERIFICATION
    if (body.event_type === "event_verification") {
        return res.status(200).json({
            seatalk_challenge: body.event.seatalk_challenge
        });
    }

    try {
        // 🔥 PERSONAL
        if (body.event_type === "message_from_bot_subscriber") {
            const seatalk_id = body.event?.seatalk_id;

            console.log("PERSONAL:", seatalk_id);

            if (seatalk_id) {
                await axios.post(
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
            }
        }

        // 🔥 GROUP
        if (body.event_type === "new_mentioned_message_received_from_group_chat") {
            const group_id = body.event?.group_id;

            console.log("GROUP:", group_id);

            if (group_id) {
                await axios.post(
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
            }
        }

    } catch (err) {
        console.log("SEND ERROR:", err.response?.data || err.message);
    }

    return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running...");
});
