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

/*function isEqual(object1, object2) {
  const props1 = Object.getOwnPropertyNames(object1);
  const props2 = Object.getOwnPropertyNames(object2);

  if (props1.length !== props2.length) {
    return false;
  }

  for (let i = 0; i < props1.length; i += 1) {
    const prop = props1[i];
    const bothAreObjects = typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object';

    if ((!bothAreObjects && (object1[prop] !== object2[prop]))
    || (bothAreObjects && !isEqual(object1[prop], object2[prop]))) {
      return false;
    }
  }

  return true;
}*/