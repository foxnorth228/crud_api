import { v4 } from "uuid";
//type user = {id: };

interface IStatus {
    status: number;
    body: ReadableStream;
}

export async function sendRequestToServer(hostname: string="localhost", port:number=3000, 
  path: string="api/users", method: string): Promise<[number, ReadableStream]> {
    const url = `http://${hostname}:${port}/${path}`;
    const answer = await fetch(url, { method: method }) as IStatus;
    return [answer.status, answer.body];
}