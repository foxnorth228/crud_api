import "dotenv/config";
import { processRequest } from"./route.js";
import { Server, createServer, IncomingMessage } from "http";
import { URL } from "url";
import { cpus } from "os";
import { get } from "http";
import cluster from "cluster";
import process from "process";

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
    setTimeout(()=>{
        for (let i = 0; i < 20; i++) {
          get('http://localhost:3000/api/users/', res => res.on('data', console.log))
        }
    }, 19000);
} else {
    console.log(`Worker ${process.pid} is running`);
    const app: Server = createServer();
    app.on("request", async (req, res) => {
        try {
            console.log(`Worker ${process.pid} is processing request now`);
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
}

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