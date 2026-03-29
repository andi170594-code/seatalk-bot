const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ❗ WAJIB ISI DENGAN BOT TOKEN ASLI
const BOT_TOKEN = "ISI_BOT_TOKEN_KAMU";

app.post("/webhook", async (req, res) => {
    const body = req.body;

    // ✅ VERIFICATION (JANGAN DIHAPUS)
    if (body.event_type === "event_verification") {
        return res.status(200).json({
            seatalk_challenge: body.event.seatalk_challenge
        });
    }

    // 🔥 AUTO REPLY
    if (body.event_type === "message.receive") {
        const chat_id =
            body.event?.message?.chat_id ||
            body.event?.chat_id;

        console.log("CHAT ID:", chat_id);

        if (!chat_id) return res.sendStatus(200);

        try {
            const response = await axios.post(
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

            console.log("SEND SUCCESS:", response.data);

        } catch (err) {
            console.log("SEND ERROR:", err.response?.data || err.message);
        }
    }

    return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running...");
});
