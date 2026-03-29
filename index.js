const express = require("express");
const crypto = require("crypto");

const app = express();

// ❗ ambil RAW body (INI PENTING BANGET)
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

const SECRET = "euaKbA93Qv6fNJdkvyYlpOfA6EVuAOhN";

app.post("/webhook", (req, res) => {
    const signature = req.headers["x-sea-signature"]; // kemungkinan header

    // 🔥 generate signature
    const hash = crypto
        .createHmac("sha256", SECRET)
        .update(req.rawBody)
        .digest("hex");

    console.log("HEADER SIGN:", signature);
    console.log("CALC SIGN:", hash);

    // ❗ kalau ada signature → validate
    if (signature && signature !== hash) {
        return res.sendStatus(403);
    }

    const body = req.body;

    // ✅ VERIFICATION
    if (body.event_type === "event_verification") {
        return res
            .status(200)
            .type("text/plain")
            .send(body.event.seatalk_challenge);
    }

    return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on", PORT);
});
