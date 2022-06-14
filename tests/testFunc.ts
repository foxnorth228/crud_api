import { v4 } from "uuid";
//type user = {id: };

export async function sendRequestToServer(server: string="localhost", 
  port:number=3000, path: string="api/users", obj: object, method: string): Promise<Object> {
    const url = `http://${server}:${port}/${path}`;
    let object: Object = {};
    try{
        const answer = await fetch(url, {
            method: method,
        });
        object = await answer.json();
        console.log(object);
    } catch(err) {
        if(err instanceof Error) {
            console.log(err.message);
            object = err;
        }
    }
    console.log(v4());
    return object;
}