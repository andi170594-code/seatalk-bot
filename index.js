const express = require("express");

const app = express();

// RAW biar aman
app.use(express.text({ type: "*/*" }));

app.post("/webhook", (req, res) => {
    try {
        console.log("RAW:", req.body);

        let data = {};
        try {
            data = JSON.parse(req.body);
        } catch {}

        const challenge =
            data.seatalk_challenge ||
            data.event?.seatalk_challenge;

        if (challenge) {
            return res.status(200).send(challenge);
        }

        return res.status(200).send("ok");

    } catch (err) {
        console.log("ERROR:", err);
        return res.status(200).send("ok");
    }
});

// ❗ INI YANG FIX 502
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT);
});
