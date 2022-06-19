// @ts-ignore
import { startServer } from "./server.ts";
interface IUser {
    id: string;
    name: string;
    age: number;
    hobbies: Array<string>;
}
const userContainer: Array<IUser> = [];
startServer(userContainer);