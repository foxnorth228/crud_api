import { v4, validate } from "uuid";
import { URL } from "url";
import { RandomUUIDOptions } from "crypto";

const route: object = {
    "/users/api/:uuid": processUsersApiID,
    "/users/api": processUsersApi,
};

function shareURL(url: string, method: string, body: object) {

}

interface IUser {
    id: string;
    name: string;
    age: number;
    hobbies: Array<string>;
}

const templateUser = {
    name: "",
    age: 0,
    hobbies: [""]
}

function processUsersApi(url: string, id:string, method: string, body: object) {
    switch(method) {
        case "GET": 
            return [200, userContainer];
        case "POST": 
            if(!checkElemInUserContainer(id) && checkIfBodyValidate(body)) {
                return [201, body];
            }
            return [400, {}];
        default: break;
    }
}

function processUsersApiID(url: string, id: string, method: string, body: object) {
    switch(method) {
        case "GET": 
            if(!validate(id)) {
                return [400, body];
            } else if (checkElemInUserContainer(id)) {
                return [201, body];
            } else {
                return [404, body];
            }
        case "PUT": 
            if(!validate(id)) {
                return [400, body];
            } else if (checkElemInUserContainer(id)) {
                return [201, body];
            } else {
                return [404, body];
            }
        case "DELETE": 
        if(!validate(id)) {
            return [400, body];
        } else if (checkElemInUserContainer(id)) {
            return [204, body];
        } else {
            return [404, body];
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

const userContainer: Array<IUser> = [];