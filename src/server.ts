import "dotenv/config";
// @ts-ignore
import { processRequest } from"./route.ts";
import process from "process";
import { Server, createServer, IncomingMessage } from "http";

export function startServer(startFunc: Function=startMessageFunction, requestFunc: Function) {
    if(startFunc && startFunc instanceof Function) {
        startFunc();
    }
    const app: Server = createServer();
    app.on("request", async (req, res) => {
        try {
            if(requestFunc && requestFunc instanceof Function) {
                requestFunc();
            }
            const url = (req.url) ? req.url : "";
            console.log(`${req.method}  ${req.url}  HTTP/${req.httpVersion}`);
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
    process.on("SIGINT", () => {
        app.close();
        process.exit();
    })
    process.on("kill", () => {
        app.close();
        process.exit();
    });
    process.on("error", () => {
        app.close();
        process.exit();
    });
    process.on("exit", () => {
        app.close();
        process.exit();
    });
}

async function getbody(res: IncomingMessage): Promise<Object> {
    return new Promise(resolve => {
        let chunks = ""; 
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            chunks += chunk;
        });
        res.on('error', (err) => {
            throw err;
        });
        res.on('end', () => {
            resolve(JSON.parse(chunks));
        });
    });
}

function startMessageFunction() {
    console.log(`The server started on port ${process.env.PORT}`);
}