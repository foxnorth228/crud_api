import "dotenv/config";
import { Server, createServer } from "http";

const app: Server = createServer();
app.on("request", (req, res) => {
    console.log(req.url);
    res.writeHead(404, {
        "Content-Type": "text/json"
    });
    res.end(JSON.stringify({}));
});
app.listen(process.env.PORT);