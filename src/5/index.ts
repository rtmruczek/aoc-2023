import fs from "fs";
import path from "path";
import { chunk } from "lodash";

const file = fs.readFileSync(path.resolve(__dirname, "./input.txt"));

const lines = file.toString().split("\n");

const seedsRegex = /seeds:\s+(.*)/;
const seeds = seedsRegex
  .exec(lines[0])[1]
  .split(/\s/)
  .map((ch) => parseInt(ch));

interface Mapping {
  source: string;
  destination?: string;
  destinationStartValue?: number;
  sourceStartValue: number;
  range: number;
}

const mappings: Mapping[] = [];
let currentGroup: { source: string; destination: string } | undefined;
const orders = [
  "seed",
  "soil",
  "fertilizer",
  "water",
  "light",
  "temperature",
  "humidity",
  "location",
];

lines.slice(1).map((line) => {
  const groupMatch = /(.*?)-to-(.*?)\s/.exec(line);
  if (groupMatch && groupMatch.length > 2) {
    currentGroup = {
      source: groupMatch[1],
      destination: groupMatch[2],
    };
  }
  const numMatch = /(\d+)\s(\d+)\s(\d+)/.exec(line);
  if (numMatch && numMatch.length > 3) {
    mappings.push({
      source: currentGroup.source,
      destination: currentGroup.destination,
      destinationStartValue: parseInt(numMatch[1]),
      sourceStartValue: parseInt(numMatch[2]),
      range: parseInt(numMatch[3]),
    });
  }
});

const numberIsInRange = ({
  number,
  range,
}: {
  number: number;
  range: { start: number; end: number };
}) => {
  return number >= range.start && number <= range.end;
};

const findNextMapping = ({
  source = "seed",
  startValue,
}: {
  source?: string;
  startValue: number;
}) => {
  const foundMapping = mappings.find(
    (next) =>
      next.source === source &&
      numberIsInRange({
        number: startValue,
        range: {
          start: next.sourceStartValue,
          end: next.sourceStartValue + next.range,
        },
      })
  );
  if (foundMapping) {
    return foundMapping;
  }

  let shortestDistanceToNextMapping = Infinity;
  let nextMapping: Mapping | undefined;

  const possibleNextMappings = mappings.filter(
    (next) => next.source === source && next.sourceStartValue > startValue
  );

  console.log(
    `there are no possible next mappings because ${startValue} is greater than the start value of any mapping`
  );

  possibleNextMappings.forEach((next) => {
    if (next.sourceStartValue - startValue < shortestDistanceToNextMapping) {
      shortestDistanceToNextMapping = next.sourceStartValue;
      nextMapping = next;
    }
  });
  return nextMapping;
};

const getNextValue = ({
  source = "seed",
  sourceStartValue,
  range,
}: Mapping): number | undefined => {
  const sourceIndex = orders.findIndex((order) => source === order);
  const destinationIndex = sourceIndex + 1;

  if (destinationIndex >= orders.length) {
    // console.log(`${source}: ${startValue}`);
    return sourceStartValue;
  }
  const destination = orders[destinationIndex];
  const toNext = mappings.find(
    (next) =>
      next.source === source &&
      numberIsInRange({
        number: sourceStartValue,
        range: {
          start: next.sourceStartValue,
          end: next.sourceStartValue + next.range,
        },
      })
  );
  if (!toNext) {
    return getNextValue({
      source: destination,
      sourceStartValue: sourceStartValue,
      range,
    });
  }
  const destinationValue =
    toNext.destinationStartValue + (sourceStartValue - toNext.sourceStartValue);

  return getNextValue({
    source: destination,
    sourceStartValue: destinationValue,
    range: toNext.range,
  });
};

let lowestValue = Infinity;

seeds.forEach((seed, index) => {
  const result = getNextValue({
    sourceStartValue: seed,
    range: 0,
    source: "seed",
  });
  if (result < lowestValue) {
    lowestValue = result;
  }
  console.log();
});

console.log(lowestValue);

const seedsWithRanges = chunk(seeds, 2);

lowestValue = Infinity;
// seedsWithRanges.slice(0, 1).forEach((seedWithRange, index) => {
//   const [startNumber, range] = seedWithRange;
//   console.log(`seed ${index}`);

//   for (let i = startNumber; i < startNumber + range; i++) {
//     getNextValue({
//       sourceStartValue: i,
//       range: startNumber + range,
//       source: "seed",
//     });
//   }

//   console.log("done");
// });

console.log(lowestValue);
