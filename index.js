const express = require("express");

const app = express();

// ❗ RAW BODY biar gak crash
app.use(express.text({ type: "*/*" }));

app.post("/webhook", (req, res) => {
    try {
        console.log("RAW:", req.body);

        let data = {};
        try {
            data = JSON.parse(req.body);
        } catch (e) {
            console.log("Not JSON, skip parse");
        }

        const challenge =
            data.seatalk_challenge ||
            data.event?.seatalk_challenge;

        if (challenge) {
            console.log("Challenge:", challenge);
            return res.status(200).send(challenge);
        }

        return res.status(200).send("ok");

    } catch (err) {
        console.log("ERROR:", err);
        return res.status(200).send("ok"); // ❗ jangan sampai 502 lagi
    }
});

app.listen(3000, () => {
    console.log("Server running...");
});
