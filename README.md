Simple CRUD server

1. To install dependencies you need print into console "npm i", and all the dependencies from package.json will be installed
2. All functionality was implemented
3. For fun I wrote tests without any pack, but they work. Before starting tests you need start the server
4. I use webpack, ts-loader to build bundle from .ts files, @types/uuid, uuid, @types/node, nodemon to development, 
    typescript and ts-node to work with .ts files
5. Exist some npm scripts:
    - "test": the requests are send gradually, step by step, tests incluse 4 scenarios with 47 tests
    - "test:multi": the requests are send at the same time
    - "start": start server in development without nodemon
    - "start:dev": start server in development with nodemon
    - "start:prod": webpack builds bundle into folder prod and then starts this bundle
    - "start:multi": start server with multiply workers that process requsts
6. Users store in memory, without any files