const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ❗ WAJIB ISI
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
        // 🔥 AMBIL THREAD ID (INI KUNCI)
        const thread_id =
            body.event?.thread_id ||
            body.event?.message?.thread_id;

        console.log("THREAD ID:", thread_id);

        if (!thread_id) return res.sendStatus(200);

        // 🔥 KIRIM BALASAN KE THREAD
        const response = await axios.post(
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

        console.log("SEND SUCCESS:", response.data);

    } catch (err) {
        console.log("SEND ERROR:", err.response?.data || err.message);
    }

    return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running...");
});
