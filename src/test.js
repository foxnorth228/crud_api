import cluster from "cluster";
import * as http from "http";

if (cluster.isPrimary) {
  for (let i = 0; i < 8; i++) {
    cluster.fork()
  }
  setTimeout(()=>{
      for (let i = 0; i < 18; i++) {
        http.get('http://localhost:3000', res => res.on('data', console.log))
      }
  }, 200);
} else {
  const workerId = cluster.worker.id
  console.log(`worker ${workerId} started`)
  http.createServer((req, res) => {
    res.writeHead(200)
    res.end(Uint8Array.from([workerId]))
  }).listen(3000)
}