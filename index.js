const express = require("express");

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
    const body = req.body;

    // ✅ VERIFICATION
    if (body.event_type === "event_verification") {
        return res.status(200).json({
            seatalk_challenge: body.event.seatalk_challenge
        });
    }

    return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running...");
});
