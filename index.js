const express = require("express");

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
    const body = req.body;

    if (body.event_type === "event_verification") {
        const challenge = body.event.seatalk_challenge;

        return res
            .status(200)
            .type("text/plain")
            .send(challenge);
    }

    return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0");
