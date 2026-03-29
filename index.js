const express = require("express");

const app = express();

// ❗ pakai raw text
app.use(express.text({ type: "*/*" }));

app.post("/webhook", (req, res) => {
    console.log("RAW BODY:", req.body);

    let challenge = null;

    try {
        const data = JSON.parse(req.body);
        challenge = data.seatalk_challenge || data.event?.seatalk_challenge;
    } catch (e) {
        // kalau bukan JSON, abaikan
    }

    // 🔥 INI KUNCI
    if (challenge) {
        res.set("Content-Type", "text/plain");
        return res.status(200).send(challenge); // HARUS pure string
    }

    return res.status(200).send("ok");
});

// ❗ wajib pakai port railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT);
});
