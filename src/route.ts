import { v4, validate } from "uuid";

const routes: object = {
    "/api/users/:uuid": processUsersApiID,
    "/api/users": processUsersApi,
};
const splitRoutes: Array<Array<string>> = [];
for (let route of Object.keys(routes)) {
    splitRoutes.push(route.split("/").filter((el) => Boolean(el)));
}
const userContainer: Array<IUser> = [];

export async function processRequest(url: string, method: string, body: object) {
    console.log(url, method, body);
    const pathArr = await shareURL(url);
    if(pathArr.length === 0) {
        return [404, {}];
    } else if(pathArr.length === 1) {
        const path = "/" + pathArr[0].join("/");
        console.log(path);
        for (let [key, value] of Object.entries(routes)) {
            if(key === path) {
                console.log(key, value);
                console.log(value(method, body));
                return value(method, body);
            }
        }
    } else {
        throw new Error(`Exist more then 1 available route that can process this url:${url}`);
    }
}

async function shareURL(url: string) {
    const elemsOfURL = url.split("/").slice(1);
    console.log(JSON.stringify(elemsOfURL));
    let arrUrls: Array<Array<string>> = splitRoutes.map((arr) => {
        return arr.slice(0);
    });
    arrUrls = arrUrls.filter((arr) => arr.length === elemsOfURL.length);
    for (let i = 0; i < elemsOfURL.length; ++i) {
        arrUrls.filter((arr) => checkRoutePath(arr[i], elemsOfURL[i]));
    }
    console.log(arrUrls);
    console.log(splitRoutes);
    return arrUrls;
}

function checkRoutePath(arr: string, getElem: string): Boolean {
    switch(true) {
        case arr.startsWith(":"): return typeof(getElem) === arr.slice(1);
        default: return arr === getElem;
    }
}

interface IUser {
    id: string;
    name: string;
    age: number;
    hobbies: Array<string>;
}

function processUsersApi(method: string, body: {id: string}) {
    switch(method) {
        case "GET": 
            return [200, userContainer];
        case "POST": 
            if(!checkElemInUserContainer(body.id) && checkIfBodyValidate(body)) {
                return [201, body];
            }
            return [400, {}];
        default: break;
    }
}

function processUsersApiID(id: string, method: string, body: object) {
    switch(method) {
        case "GET": 
            if(!validate(id)) {
                return [400, body];
            } else {
                const user = checkElemInUserContainer(id);
                if (user) {
                    return [201, user];
                } else {
                    return [404, body];
                }
            }
        case "PUT": 
            if(!validate(id)) {
                return [400, body];
            } else {
                const user = checkElemInUserContainer(id);
                if (user) {
                    const index = userContainer.findIndex((el) => el.id === user.id);
                    userContainer.splice(index, 1, body as IUser);
                    return [201, user];
                } else {
                    return [404, body];
                }
            }
        case "DELETE": 
        if(!validate(id)) {
            return [400, body];
        } else {
            const user = checkElemInUserContainer(id);
            if (user) {
                const index = userContainer.findIndex((el) => el.id === user.id);
                userContainer.splice(index, 1);
                return [204, user];
            } else {
                return [404, body];
            }
        }
        default: break;
    }
}

function User(name:string, age: number, hobbies: Array<string>) {
    let user: IUser = {
        id: v4(),
        name: name,
        age: age,
        hobbies: hobbies
    }
    return user;
}

function checkElemInUserContainer(id: string): IUser | null {
    for (let elem of userContainer) {
        if (id === elem.id) {
            return Object.assign({}, elem);
        }
    }
    return null;
}

function checkIfBodyValidate(object: object): Boolean {
    const templateUser = {
        name: "",
        age: 0,
        hobbies: [""]
    }
    if (Object.keys(object).length !== 3) {
        return false;
    }

    let hasProperty = true;
    for (let [key1, value1] of Object.entries(object)) {
        if(!hasProperty) {
            return false;
        }
        hasProperty = false;
        for (let [key2, value2] of Object.entries(templateUser)) {
            if(key1 === key2 && typeof(value1) === typeof(value2)) {
                hasProperty = true;
                continue;
            }
        }
    }
    return true;
}