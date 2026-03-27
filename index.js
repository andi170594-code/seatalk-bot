const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const BOT_TOKEN = "ISI_BOT_TOKEN_KAMU";

app.post("/webhook", async (req, res) => {
    const body = req.body;

    if (body.seatalk_challenge) {
        return res.send(body.seatalk_challenge);
    }

    try {
        if (body.event_type === "message.receive") {
            const chat_id = body.event.message.chat_id;

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
        }

    } catch (err) {
        console.error(err.response?.data || err.message);
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log("Server running...");
});
