import "dotenv/config";
import { request } from "http";

const port = (process.env.PORT) ? Number(process.env.PORT) : 3000;

export async function testRequestFunc(method: string="GET", object: object={},
    path: string="api/users"): Promise<[number, object]> {
    return await sendRequestToServer("localhost", port, path, method, object);;
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
    const [status, body] = await getResponsefromServer(url, options, object, method);
    return [status, body]
}

async function getResponsefromServer(url: string, options: object, object: object, method: string): Promise<[number, object]> {
    return new Promise(resolve => {
        const req = request(url, options, async (res) => {
            if(method === "DELETE") {
                resolve([res.statusCode as number, {}]);
            } else {
                let chunks = ""; 
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    chunks += chunk;
                });
                res.on('end', () => {
                    resolve([res.statusCode as number, JSON.parse(chunks)]);
                });
            }
        });
        req.write(JSON.stringify(object));
        req.end();
    });
}