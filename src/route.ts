import { v4, validate } from "uuid";

const routes: object = {
    "/api/users/:uuid": processUsersApiID,
    "/api/users": processUsersApi,
};
const splitRoutes: Array<Array<string>> = [];
for (let route of Object.keys(routes)) {
    splitRoutes.push(route.split("/").filter((el) => el));
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
                return value(method, body, url);
            }
        }
    } else {
        throw new Error(`Exist more then 1 available route that can process this url:${url}`);
    }
}

async function shareURL(url: string) {
    console.log(url)
    const elemsOfURL = url.split("/").filter((el) => el);
    console.log(JSON.stringify(elemsOfURL));
    let arrUrls: Array<Array<string>> = splitRoutes.map((arr) => {
        return arr.slice(0);
    });
    arrUrls = arrUrls.filter((arr) => arr.length === elemsOfURL.length);
    for (let i = 0; i < elemsOfURL.length; ++i) {
        arrUrls = arrUrls.filter((arr) => checkRoutePath(arr[i], elemsOfURL[i]));
    }
    console.log(arrUrls);
    console.log(splitRoutes);
    return arrUrls;
}

function checkRoutePath(arr: string, getElem: string): boolean {
    console.log(arr,getElem, arr === getElem, arr.slice(1), arr.slice(1) === "uuid")
    switch(true) {
        case arr.startsWith(":"): if(arr.slice(1) === "uuid") { return true };
        default: return arr === getElem;
    }
}

interface IUser {
    id: string;
    name: string;
    age: number;
    hobbies: Array<string>;
}

function processUsersApi(method: string, body: object, url: string) {
    switch(method) {
        case "GET": 
            return [200, userContainer];
        case "POST": 
            console.log("POST ELEM");
            if(checkIfBodyValidate(body)) {
                const elem = Object.assign({id: v4()}, body) as IUser;
                userContainer.push(elem);
                return [201, elem];
            }
            return [400, {}];
        case "DELETE":
            console.log("DELETE")
            userContainer.length = 0;
            return [204, {}];
        default: break;
    }
}

function processUsersApiID(method: string, body: object, url: string) {
    const id = url.split("/").filter((el) => el)[2];
    console.log(method, id);
    switch(method) {
        case "GET": 
            if(!validate(id)) {
                return [400, body];
            } else {
                const user = checkElemInUserContainer(id);
                if (user) {
                    return [200, user];
                } else {
                    return [404, {}];
                }
            }
        case "PUT": 
            if(!validate(id)) {
                return [400, body];
            } else {
                const user = checkElemInUserContainer(id);
                if (user) {
                    const index = userContainer.findIndex((el) => el.id === user.id);
                    userContainer[index].name = user.name;
                    userContainer[index].age = user.age;
                    userContainer[index].hobbies = user.hobbies;
                    return [200, userContainer[index]];
                } else {
                    console.log("WRONG PUT")
                    return [404, {}];
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
                console.log("WRONG DELETE")
                return [404, body];
            }
        }
        default: return [404, {}];
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
    console.log("type: ", typeof(object))
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