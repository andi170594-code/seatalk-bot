const http = require("http");

const server = http.createServer((req, res) => {

    if (req.method === "POST" && req.url === "/webhook") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);

                if (data.event_type === "event_verification") {
                    const challenge = data.event.seatalk_challenge;

                    // 🔥 TANPA HEADER APAPUN
                    return res.end(challenge);
                }

            } catch (e) {}

            return res.end("ok");
        });

        return;
    }

    res.end("ok");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on", PORT);
});
