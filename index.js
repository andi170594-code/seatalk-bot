const express = require("express");

const app = express();

// RAW body
app.use(express.text({ type: "*/*" }));

app.post("/webhook", (req, res) => {
    try {
        const data = JSON.parse(req.body);

        // 🔥 WAJIB INI (NO LOGIC LAIN)
        if (data.event_type === "event_verification") {
            const challenge = data.event.seatalk_challenge;

            res.set("Content-Type", "text/plain");
            return res.send(challenge); // ❗ langsung return
        }

    } catch (e) {
        // ignore
    }

    return res.send("ok");
});

// PORT railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0");
