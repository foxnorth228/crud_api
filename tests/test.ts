import { testRequestFunc } from "./testFunc.js";
import { v4 } from "uuid";

type basicTypes = boolean | number | string | object;

class Test {
    private static numTests = 0;
    private static succeedTests = 0;
    private static failedTests = 0;

    private static async failedTestElement(arr: basicTypes[], answer: basicTypes[], num: number) {
        console.log("***");
        console.log(`Test ${Test.numTests} failed`);
        console.log(`${arr.join(", ")} is not like ${answer.join(", ")}`);
        console.log(`${JSON.stringify(arr[num])} is not like ${JSON.stringify(answer[num])}`);
        console.log("***");
        Test.failedTests++;
    }

    private static async failedTestCount(arr: basicTypes[], answer: basicTypes[]) {
        console.log("***");
        console.log(`Test ${Test.numTests} failed`);
        console.log(`Number of testing elements is ${arr.length}, but number elements in answer is ${answer.length}`);
        console.log("***");
        Test.failedTests++;
    }

    private static async succeedTest() {
        console.log(`Test ${Test.numTests} succeed`);
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
        Test.numTests++;
        try { 
            const answer = await func(...args); 
            console.log(JSON.stringify(arr), JSON.stringify(answer));
            if (answer.length != arr.length) {
                Test.failedTestCount(arr, answer);
                return;
            }
            for (let i = 0; i < answer.length; ++i) {
                if(arr[i] instanceof Object) {
                    console.log("Object!!");
                    if (isEqual(arr[i] as Object, answer[i])) {
                        continue;
                    } else {
                        await Test.failedTestElement(arr, answer, i);
                        return;
                    }
                } else {
                    if (arr[i] === answer[i]) {
                        continue;
                    } else {
                        await Test.failedTestElement(arr, answer, i);
                        return;
                    }
                }
            }
            Test.succeedTest();
        } catch(err) {
            throw err;
            //Test.errorTest(err);
        }
    }

    /*static async endMessage() {
        console.log(`\nAll number of tests: ${Test.numTests}, \nSuccessful tests: ${Test.succeedTests}`);
        console.log(`Failed tests: ${Test.failedTests}`);
    }*/
}

async function checkIfServerWork() {
    await Test.testAsyncFunction(testRequestFunc, [200, []], "GET");
    await Test.testAsyncFunction(testRequestFunc, [400, {}], "POST", { aaa: 222, bbb: 22 });
    await Test.testAsyncFunction(testRequestFunc, [201, {name: 22,age: 22,hobbies: ["bear", "wine"]}],
    "POST", {
        name: "name",
        age: 22,
        hobbies: ["bear", "wine"]
    });
    await Test.testAsyncFunction(testRequestFunc, [200, [{name: "name",age: 22,hobbies: ["bear", "wine"]}]], "GET");
}

async function workWithSingleUser() { 
    await testRequestFunc("GET");
    await testRequestFunc("POST", {});
    await testRequestFunc("GET");
    await testRequestFunc("PUT", {});
    await testRequestFunc("GET");
    await testRequestFunc("DELETE", {});
    await testRequestFunc("GET");
}

async function workWithMultipleUsers() {
    await testRequestFunc("GET");
    await testRequestFunc("POST", {});
    await testRequestFunc("POST", {});
    await testRequestFunc("POST", {});
    await testRequestFunc("POST", {});
    await testRequestFunc("POST", {});
    await testRequestFunc("GET", {});
    await testRequestFunc("PUT", {});
    await testRequestFunc("PUT", {});
    await testRequestFunc("PUT", {});
    await testRequestFunc("GET", {});
    await testRequestFunc("DELETE", {});
    await testRequestFunc("DELETE", {});
    await testRequestFunc("GET", {});
    await testRequestFunc("DELETE", {});
    await testRequestFunc("DELETE", {});
    await testRequestFunc("DELETE", {});
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
            await testRequestFunc(method, {}, path);
        }
    }
}

checkIfServerWork();
//workWithSingleUser();
//workWithMultipleUsers();
//negativeTests();
//Test.endMessage();

function isEqual(object1: Object, object2: Object): boolean {
    const keys1 = Object.entries(object1);
    const keys2 = Object.entries(object2);
    console.log("objects", keys1, keys2)
    let isInclude = true;
    for(let i = 0; i < keys1.length; ++i) {
        if (!isInclude) {
            return false;
        }
        isInclude = false;
        for(let j = 0; j < keys2.length; ++j) {
            if (keys1[i][0] === keys2[j][0]) {
                console.log(typeof(keys1[i][1]), typeof(keys2[j][1]));
                if(typeof(keys1[i][1]) === "object") {
                    isInclude = isEqual(keys1[i][1], keys2[j][1]);
                    break;
                } else if(typeof(keys1[i][1] === typeof(keys2[j][1]))) {
                    isInclude = true;
                    break;
                }
            } else {
                isInclude = false;
                break;
            }
        }
    }
    return true;
}