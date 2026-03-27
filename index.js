const express = require("express");

const app = express();

// ❗ pakai RAW body (INI KUNCI)
app.use(express.text({ type: "*/*" }));

app.post("/webhook", (req, res) => {
    console.log("RAW BODY:", req.body);

    try {
        // coba parse kalau JSON
        let data;
        try {
            data = JSON.parse(req.body);
        } catch {
            data = {};
        }

        const challenge =
            data.seatalk_challenge ||
            data.event?.seatalk_challenge;

        if (challenge) {
            console.log("Challenge OK:", challenge);
            return res.status(200).send(challenge);
        }

    } catch (err) {
        console.log("Error parsing:", err);
    }

    return res.send("ok");
});

app.listen(3000, () => {
    console.log("Server running...");
});
