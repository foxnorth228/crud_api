import "dotenv/config";
import { processRequest } from"./route.js";
import { Server, createServer, IncomingMessage } from "http";
import { URL } from "url";
import { cpus } from "os";
import cluster from "cluster";
import { Worker } from "cluster";
import process from "process";

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    const workerBody: Array<{worker: Worker, isRunning: boolean}> = [];
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        let worker = cluster.fork();
        workerBody.push({worker: worker, isRunning: false});
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
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
            let index = workerBody.findIndex((el) => el.isRunning === false);
            if (index !== -1) {
                await blockWithWorker(req, workerBody[index].worker)
                workerBody[index].isRunning = true;
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
} else {
    console.log(`Worker ${process.pid} is running`);
    process.on("message", (mes) => {
        if("send" in process)
        process.send?.(mes);
    });
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

async function blockWithWorker(req: IncomingMessage, worker: Worker): Promise<Object> {
    return new Promise(resolve => {
        worker.send("LoL");
        worker.on("message", (mes) => {
            console.log(worker.process.pid, mes);
            resolve({});
        })
    });
}