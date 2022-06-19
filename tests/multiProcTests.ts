import { get } from "http";

for (let i = 0; i < 18; i++) {
    get('http://localhost:3000/api/users/', res => {
        res.on('data', console.log)
        res.on('error', err => { throw err });
    })
    .on("error", (err) => {
        if (err instanceof Error) {
            console.log("You must started server before start by 'npm run start:multi' this test");
        }
    })
}