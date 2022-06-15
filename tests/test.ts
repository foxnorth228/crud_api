import { testRequestFunc } from "./testFunc.js";
import { v4 } from "uuid";



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
                if(arr[i] instanceof Object) {
                    if (isEqual(arr[i] as Object, answer[i])) {
                        continue;
                    } else {
                        Test.failedTestElement(arr, answer, i);
                        return;
                    }
                } else {
                    if (arr[i] === answer[i]) {
                        continue;
                    } else {
                        Test.failedTestElement(arr, answer, i);
                        return;
                    }
                }
            }
            Test.succeedTest();
        } catch(err) {
            Test.errorTest(err);
        }
    }

    static async endMessage() {
        console.log(`\nAll number of tests: ${Test.numTests}, \nSuccessful tests: ${Test.succeedTests}`);
        console.log(`Failed tests: ${Test.failedTests}`);
    }
}

async function checkIfServerWork() {
    await Test.testAsyncFunction(testRequestFunc, [404, {}], "GET");
}

async function workWithSingleUser() { 
    await testRequestFunc("GET");
    await testRequestFunc("POST");
    await testRequestFunc("GET");
    await testRequestFunc("PUT");
    await testRequestFunc("GET");
    await testRequestFunc("DELETE");
    await testRequestFunc("GET");
}

async function workWithMultipleUsers() {
    await testRequestFunc("GET");
    await testRequestFunc("POST");
    await testRequestFunc("POST");
    await testRequestFunc("POST");
    await testRequestFunc("POST");
    await testRequestFunc("POST");
    await testRequestFunc("GET");
    await testRequestFunc("PUT");
    await testRequestFunc("PUT");
    await testRequestFunc("PUT");
    await testRequestFunc("GET");
    await testRequestFunc("DELETE");
    await testRequestFunc("DELETE");
    await testRequestFunc("GET");
    await testRequestFunc("DELETE");
    await testRequestFunc("DELETE");
    await testRequestFunc("DELETE");
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
            await testRequestFunc(method, path);
        }
    }
}

checkIfServerWork();
//workWithSingleUser();
//workWithMultipleUsers();
//negativeTests();
Test.endMessage();

function isEqual(object1: object, object2: object): Boolean {
    const keys1: Array<string> = Object.keys(object1);
    const keys2 = Object.keys(object2);
    const values1 = Object.values(object1);
    const values2 = Object.values(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key1 in object1) {
        console.log(key1);
    }
  return true;
}