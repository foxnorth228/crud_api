import "dotenv/config";
import { processRequest } from"./route.js";
import { Server, createServer, IncomingMessage } from "http";
import { URL } from "url";

const app: Server = createServer();
app.on("request", async (req, res) => {
    try {
        //console.log(req.url);
        res.writeHead(404, {
            "Content-Type": "text/json"
        });
        //console.log(req.headers);
        const url = (req.url) ? req.url : "";
        //console.log(new URL(url, `http://${req.headers.host}`));
        let body: object;
        if (req.method !== "GET") {
            body = await getbody(req);
        } else {
            body = {};
        }
        await processRequest(url, req.method as string, body);
        res.end(JSON.stringify({}));
    } catch(err) {
        res.writeHead(500, {
            "Content-Type": "text/json"
        });
        res.end(JSON.stringify({err}));
    }
    
});
app.listen(process.env.PORT);

async function getbody(res: IncomingMessage): Promise<Object> {
    return new Promise(resolve => {
        let chunks = ""; 
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            chunks += chunk;
        })
        res.on('end', () => {
            resolve(JSON.parse(chunks))
        });
    });
}