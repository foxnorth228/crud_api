import { sendRequestToServer } from "./testFunc.js";
import { v4 } from "uuid";

const testRequestFunc = (object: object={}, method: string="GET", path:string="api/users") => 
  sendRequestToServer("localhost", 3000, path, object, method);

async function checkIfServerWork() {
    await testRequestFunc({}, "GET");
}

async function workWithSingleUser() { 
    await testRequestFunc({}, "GET");
    await testRequestFunc({}, "POST");
    await testRequestFunc({}, "GET");
    await testRequestFunc({}, "PUT");
    await testRequestFunc({}, "GET");
    await testRequestFunc({}, "DELETE");
    await testRequestFunc({}, "GET");
}

async function workWithMultipleUsers() {
    await testRequestFunc({}, "GET");
    await testRequestFunc({}, "POST");
    await testRequestFunc({}, "POST");
    await testRequestFunc({}, "POST");
    await testRequestFunc({}, "POST");
    await testRequestFunc({}, "POST");
    await testRequestFunc({}, "GET");
    await testRequestFunc({}, "PUT");
    await testRequestFunc({}, "PUT");
    await testRequestFunc({}, "PUT");
    await testRequestFunc({}, "GET");
    await testRequestFunc({}, "DELETE");
    await testRequestFunc({}, "DELETE");
    await testRequestFunc({}, "GET");
    await testRequestFunc({}, "DELETE");
    await testRequestFunc({}, "DELETE");
    await testRequestFunc({}, "DELETE");
}

async function negativeTests() {
    const wrongPaths = [
        "api/",
        "api/u",
        "api/users/111",
        `api/users/${v4()}`
    ];
    const methods = [
        "GET",
        "POST",
        "PUT",
        "DELETE"
    ]
    for await (let path of wrongPaths) {
        for await (let method of methods) {
            await testRequestFunc({}, method, path);
        }
    }
}

checkIfServerWork();
workWithSingleUser();
workWithMultipleUsers();
negativeTests();