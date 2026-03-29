const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ❗ WAJIB GANTI INI
const BOT_TOKEN = "ISI_BOT_TOKEN_KAMU";

app.post("/webhook", async (req, res) => {
    const body = req.body;

    console.log("FULL EVENT:", JSON.stringify(body));

    // ✅ VERIFICATION (WAJIB ADA)
    if (body.event_type === "event_verification") {
        return res.status(200).json({
            seatalk_challenge: body.event.seatalk_challenge
        });
    }

    try {
        // 🔥 PERSONAL CHAT (1 ON 1)
        if (body.event_type === "user_enter_chatroom_with_bot") {
            const seatalk_id = body.event?.seatalk_id;

            console.log("PERSONAL CHAT:", seatalk_id);

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

        // 🔥 GROUP CHAT
        if (body.event_type === "message.receive") {
            const thread_id =
                body.event?.thread_id ||
                body.event?.message?.thread_id;

            console.log("GROUP THREAD:", thread_id);

            if (thread_id) {
                await axios.post(
                    "https://openapi.seatalk.io/open-apis/message/v2/send/",
                    {
                        thread_id: thread_id,
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
