import { sendRequestToServer } from "./testFunc.js";
import { v4 } from "uuid";

async function testRequestFunc(object: object={}, method: string="GET",
 path: string="api/users"): Promise<[number, string]> {
    const [status, body] = await sendRequestToServer("localhost", 3000, path, method);
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
    return [status, JSON.parse(result)];
}

type basicTypes = boolean | number | string | object;

class Test {
    private static numTests = 1;
    private static succeedTests = 0;
    private static failedTests = 0;

    private static failedTestElement(arr: basicTypes[], answer: basicTypes[], num: number) {
        console.log("***");
        console.log(`Test ${Test.numTests} failed`);
        console.log(`${arr.join(", ")} is not like ${answer.join(", ")}`);
        console.log(`${JSON.stringify(arr[num])} is not like ${JSON.stringify(answer[num])}`);
        console.log("***");
        Test.numTests++;
        Test.failedTests++;
    }

    private static failedTestCount(arr: basicTypes[], answer: basicTypes[]) {
        console.log("***");
        console.log(`Test ${Test.numTests} failed`);
        console.log(`Number of testing elements is ${arr.length}, but number elements in answer is ${answer.length}`);
        console.log("***");
        Test.numTests++;
        Test.failedTests++;
    }

    private static succeedTest() {
        Test.numTests++;
        Test.succeedTests++;
    }

    private static errorTest(err: unknown) {
        if(err instanceof Error) {
            console.log(`In ${Test.numTests} test catch error: ${err.message}`);
        }
        Test.numTests++;
        Test.failedTests++;
    }

    static async testAsyncFunction(func: Function, arr: basicTypes[], ...args: basicTypes[]) {
        try { 
            const answer = await func(args); 
            if (answer.length != arr.length) {
                Test.failedTestCount(arr, answer);
                return;
            }
            for (let i = 0; i < answer.length; ++i) {
                if (arr[i] === answer[i]) {
                    continue;
                } else {
                    Test.failedTestElement(arr, answer, i);
                    return;
                }
            }
            Test.succeedTest();
        } catch(err) {
            Test.errorTest(err);
        }
    }
}

async function checkIfServerWork() {
    await Test.testAsyncFunction(testRequestFunc, [404, {}], {}, "GET");
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
//workWithSingleUser();
//workWithMultipleUsers();
//negativeTests();