const http = require("http");
const querystring = require("querystring");

const server = http.createServer((req, res) => {

    // TEST
    if (req.method === "GET" && req.url === "/test-challenge") {
        const challenge = "ABC123";
        res.writeHead(200, {
            "Content-Type": "text/plain",
            "Content-Length": Buffer.byteLength(challenge)
        });
        return res.end(challenge);
    }

    if (req.method === "POST" && req.url === "/webhook") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            console.log("RAW BODY:", body);

            let challenge = null;

            // ✅ 1. Coba JSON
            try {
                const data = JSON.parse(body);
                if (data.event_type === "event_verification") {
                    challenge = data.event?.seatalk_challenge;
                }
            } catch {}

            // ✅ 2. Coba FORM (fallback)
            if (!challenge) {
                const parsed = querystring.parse(body);
                challenge = parsed.seatalk_challenge;
            }

            // 🔥 RETURN EXACT
            if (challenge) {
                res.writeHead(200, {
                    "Content-Type": "text/plain",
                    "Content-Length": Buffer.byteLength(challenge)
                });
                return res.end(challenge);
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
