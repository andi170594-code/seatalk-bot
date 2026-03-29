const http = require("http");

const server = http.createServer((req, res) => {
    // 🔥 TEST ENDPOINT
    if (req.method === "GET" && req.url === "/test") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("TEST_OK");
    }

    // 🔥 WEBHOOK
    if (req.method === "POST" && req.url === "/webhook") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);

                // ✅ VERIFICATION
                if (data.event_type === "event_verification") {
                    const challenge = data.event.seatalk_challenge;

                    res.writeHead(200, {
                        "Content-Type": "text/plain",
                        "Content-Length": Buffer.byteLength(challenge)
                    });

                    return res.end(challenge);
                }

            } catch (e) {
                console.log("ERROR:", e);
            }

            res.writeHead(200);
            res.end("ok");
        });

        return;
    }

    res.writeHead(404);
    res.end();
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on", PORT);
});
