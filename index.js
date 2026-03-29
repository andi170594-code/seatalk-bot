const express = require("express");

const app = express();

// RAW supaya aman
app.use(express.text({ type: "*/*" }));

app.post("/webhook", (req, res) => {
    console.log("RAW BODY:", req.body);

    try {
        const data = JSON.parse(req.body);

        // 🔥 INI YANG BENAR
        if (data.event_type === "event_verification") {
            const challenge = data.event?.seatalk_challenge;

            if (challenge) {
                console.log("Challenge:", challenge);
                res.set("Content-Type", "text/plain");
                return res.status(200).send(challenge);
            }
        }

    } catch (err) {
        console.log("Parse error:", err);
    }

    return res.status(200).send("ok");
});

// PORT railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT);
});
