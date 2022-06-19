import { get } from "http";
try {
    for (let i = 0; i < 1; i++) {
        get('http://localhost:3000/api/users/', res => {
            res.on('data', console.log)
            res.on('error', err => { throw err });
        })
    }
} catch(err) {
    console.log("bug");
}
