const express = require("express");

const app = express();

// ✅ Pakai JSON parser (INI KUNCI)
app.use(express.json());

app.post("/webhook", (req, res) => {
    const body = req.body;

    // 🔥 HANDLE VERIFICATION
    if (body.event_type === "event_verification") {
        const challenge = body.event?.seatalk_challenge;

        if (challenge) {
            // ❗ HARUS TEXT PLAIN & EXACT
            res.setHeader("Content-Type", "text/plain");
            return res.status(200).send(challenge);
        }
    }

    // default response
    return res.sendStatus(200);
});

// ❗ PORT WAJIB DARI RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Running on", PORT);
});
