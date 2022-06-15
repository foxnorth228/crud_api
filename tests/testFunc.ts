import { v4 } from "uuid";
//type user = {id: };

interface IStatus {
    status: number;
    body: ReadableStream;
}

async function sendRequestToServer(hostname: string="localhost", port:number=3000, 
    path: string="api/users", method: string): Promise<[number, ReadableStream]> {
    const url = `http://${hostname}:${port}/${path}`;
    const answer = await fetch(url, { method: method }) as IStatus;
    return [answer.status, answer.body];
}

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

export async function testRequestFunc(method: string="GET",
 path: string="api/users"): Promise<[number, object]> {
    const [status, body] = await sendRequestToServer("localhost", 3000, path, method);
    
    return [status, await readResponseBody(body)];
}