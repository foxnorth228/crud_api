import { cpus } from "os";
import cluster from "cluster";
import { Worker } from "cluster";
import process from "process";
//@ts-ignore
import { startServer } from "./server.ts";

const numCPUs = cpus().length;
interface IUser {
    id: string;
    name: string;
    age: number;
    hobbies: Array<string>;
}
const userContainer: Array<IUser> = [];
if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    const workers: Array<Worker> = [];
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      workers.push(cluster.fork());
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
    process.on("SIGINT", () => {
        for (let worker of workers) {
            worker.kill();
        }
        process.exit();
    })
    process.on("kill", () => {
        for (let worker of workers) {
            worker.kill();
        }
        process.exit();
    });
    process.on("error", () => {
        for (let worker of workers) {
            worker.kill();
        }
        process.exit();
    });
    process.on("exit", () => {
        for (let worker of workers) {
            worker.kill();
        }
        process.exit();
    });
} else {
    function runWorker() {
        console.log(`Worker ${process.pid} is running`);
    }
    function checkWorker() {
        console.log(`Worker ${process.pid} is processing request now`);
    }
    startServer(userContainer, runWorker, checkWorker);
}