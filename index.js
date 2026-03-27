const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ❗ WAJIB ISI INI
const BOT_TOKEN = "ISI_BOT_TOKEN_KAMU";

app.post("/webhook", async (req, res) => {
    const body = req.body;

    console.log("Incoming:", JSON.stringify(body));

    // ✅ FIX VERIFIKASI (INI YANG PENTING)
    const challenge = body.seatalk_challenge || body.event?.seatalk_challenge;

    if (challenge) {
        console.log("Challenge received:", challenge);
        return res.status(200).send(challenge);
    }

    try {
        // ✅ HANDLE MESSAGE
        if (body.event_type === "message.receive") {
            const chat_id = body.event?.message?.chat_id;

            if (!chat_id) return res.sendStatus(200);

            // 🔥 AUTO REPLY
            await axios.post(
                "https://openapi.seatalk.io/open-apis/message/v2/send/",
                {
                    chat_id: chat_id,
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

            console.log("Replied: Approved");
        }

    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
