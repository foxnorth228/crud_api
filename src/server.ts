import "dotenv/config";
// @ts-ignore
import { processRequest } from"./route.ts";
import { Server, createServer, IncomingMessage } from "http";
import { URL } from "url";

const app: Server = createServer();
app.on("request", async (req, res) => {
    try {
        const url = (req.url) ? req.url : "";
        let body: object;
        if (req.method !== "GET" && req.method !== "DELETE") {
            body = await getbody(req);
        } else {
            body = {};
        }
        const [code, answerBody] = await processRequest(url, req.method as string, body);
        res.writeHead(code, {
            "Content-Type": "text/json"
        });
        console.log("answer", answerBody)
        res.end(JSON.stringify(answerBody));
    } catch(err) {
        res.writeHead(500, {
            "Content-Type": "text/json"
        });
        if(err instanceof Error) {
            console.log(err.message)
        }
        res.end(JSON.stringify(err));
    }
    
}); 
app.on("error", (err) => {
    console.log(`Something in server is wrong: ${err.message})`);
});
app.listen(process.env.PORT);
console.log(`The server started on port ${process.env.PORT}`);

async function getbody(res: IncomingMessage): Promise<Object> {
    return new Promise(resolve => {
        let chunks = ""; 
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            chunks += chunk;
        })
        res.on('end', () => {
            resolve(JSON.parse(chunks));
        });
    });
}