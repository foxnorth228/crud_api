import { v4 } from "uuid";
import { request } from "http";

export async function testRequestFunc(method: string="GET", object: object={},
    path: string="api/users"): Promise<[number, object]> {
    return await sendRequestToServer("localhost", 3000, path, method, object);;
}

async function sendRequestToServer(hostname: string="localhost", port:number=3000, 
    path: string="api/users", method: string, object: object): Promise<[number, object]> {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'text/json',
      }
    };
    const url = `http://${hostname}:${port}/${path}`;
    return await getResponsefromServer(url, options, object);;
}

async function getResponsefromServer(url: string, options: object, object: object): Promise<[number, object]> {
    return new Promise(resolve => {
        const req = request(url, options, async (res) => {
            let chunks = ""; 
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                chunks += chunk;
            });
            res.on('end', () => {
                resolve([res.statusCode as number, JSON.parse(chunks)]);
            });
        });
        req.write(JSON.stringify(object));
        req.end();
    });
}

/*
async function readResponseBody(body: ReadableStream): Promise<object> {
    const reader = body.getReader();
    let receivedLength = 0;
    let chunks = []; 
    while(true) {
        const {done, value} = await reader.read();
        if (done) {
            break;
        }
        chunks.push(value);
        receivedLength += value.length;
    }
    let chunksAll = new Uint8Array(receivedLength); // (4.1)
    let position = 0;
    for(let chunk of chunks) {
        chunksAll.set(chunk, position); // (4.2)
        position += chunk.length;
    }
    let result = new TextDecoder("utf-8").decode(chunksAll);
    return JSON.parse(result);
}
*/