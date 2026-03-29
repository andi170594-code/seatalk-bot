const express = require("express");

const app = express();

// ❗ RAW body
app.use(express.text({ type: "*/*" }));

app.post("/webhook", (req, res) => {
    try {
        const body = req.body;
        const data = JSON.parse(body);

        if (data.event_type === "event_verification") {
            const challenge = data.event.seatalk_challenge;

            // 🔥 RETURN TANPA HEADER TAMBAHAN
            return res.end(challenge);
        }

    } catch (e) {}

    return res.end("ok");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0");
