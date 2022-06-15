import "dotenv/config";
import { Server, createServer } from "http";
import { URL } from "url";

const app: Server = createServer();
app.on("request", (req, res) => {
    console.log(req.url);
    res.writeHead(404, {
        "Content-Type": "text/json"
    });
    //console.log(req.headers);
    const url = (req.url) ? req.url : "";
    console.log(new URL(url));
    res.end(JSON.stringify({}));
});
app.listen(process.env.PORT);