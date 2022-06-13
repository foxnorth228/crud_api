import { v4 } from "uuid";
//type user = {id: };
export async function func(server: string="localhost", 
  port:number=3000, path: string, obj: object): Promise<Boolean> {
    const url = `http://${server}:${port}/${path}`;
    try{
        const answer = await fetch(url);
    } catch(err) {
        if(err instanceof Error) {
            console.log(err.message);
        }
    }
    console.log(v4());
    return false;
}