const express = require("express");
const axios = require("axios");

const app = express();

// ❗ INI PENTING BANGET
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const BOT_TOKEN = "ISI_BOT_TOKEN_KAMU";

app.post("/webhook", async (req, res) => {
    console.log("HEADERS:", req.headers);
    console.log("BODY:", req.body);

    // ✅ HANDLE SEMUA KEMUNGKINAN FORMAT
    const challenge =
        req.body?.seatalk_challenge ||
        req.body?.event?.seatalk_challenge ||
        req.query?.seatalk_challenge;

    // 🔥 WAJIB RETURN STRING TANPA JSON
    if (challenge) {
        console.log("Challenge OK:", challenge);
        return res.status(200).send(String(challenge));
    }

    try {
        if (req.body.event_type === "message.receive") {
            const chat_id = req.body.event?.message?.chat_id;

            if (!chat_id) return res.sendStatus(200);

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

            console.log("Replied Approved");
        }

    } catch (err) {
        console.error("ERROR:", err.response?.data || err.message);
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
