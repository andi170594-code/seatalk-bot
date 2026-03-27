const express = require("express");

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
    console.log("BODY:", req.body);

    if (req.body.seatalk_challenge) {
        return res.send(req.body.seatalk_challenge);
    }

    return res.send("ok");
});

app.listen(3000, () => {
    console.log("Server running...");
});
