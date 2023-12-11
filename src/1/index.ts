import fs from "fs";
import path from "path";

const file = fs.readFileSync(path.resolve(__dirname, "./input.txt"));

const lines = file.toString();

const digits = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const t0 = performance.now();

const digitsStr = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const regex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;

const getMatchesForString = (str: string): string[] => {
  let array = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    array.push(match[1]);
  }
  return array;
};

const result = lines.split("\n").reduce<number>((acc, current) => {
  const match = getMatchesForString(current);

  const tens = digitsStr.includes(match[0])
    ? parseInt(match[0]) * 10
    : digits[match[0] as keyof typeof digits] * 10;
  const ones = digitsStr.includes(match[match.length - 1])
    ? parseInt(match[match.length - 1])
    : digits[match[match.length - 1] as keyof typeof digits];

  const lineResult = tens + ones;

  return acc + lineResult;
}, 0);

console.log(result);

const t1 = performance.now();

console.log(`took ${t1 - t0} milliseconds.`);
