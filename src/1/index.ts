import fs from "fs";
import path from "path";

const file = fs.readFileSync(path.resolve(__dirname, "./input.txt"));

console.log(file.toString());
