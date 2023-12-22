import fs from "fs";
import path from "path";

const file = fs.readFileSync(path.resolve(__dirname, "./input.txt"));

const lines = file.toString().split("\n");
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
const getNumbersFromLine = (line: string): number[] => {
  return line
    .split(/\s/)
    .filter((ch) => !!ch.length)
    .map((ch) => parseInt(ch));
};

interface Card {
  id: number;
  lotteryNumbers: number[];
  myNumbers: number[];
}

const cards = lines.map((line) => {
  const regex = /Card\s+(\d+):(.*?)\|(.*)$/;

  const match = regex.exec(line);
  const lotteryNumbers = getNumbersFromLine(match[2]);
  const myNumbers = getNumbersFromLine(match[3]);

  return {
    id: parseInt(match[1]),
    lotteryNumbers,
    myNumbers,
  };
});

let sum = 0;
cards.forEach(({ lotteryNumbers, myNumbers }) => {
  let currentSum = 0;
  let counts: Record<number, number> = {};
  lotteryNumbers.forEach((number) => {
    if (counts[number]) {
      counts[number] = counts[number] + 1;
    } else {
      counts[number] = 1;
    }
  });

  myNumbers.forEach((number) => {
    if (counts[number]) {
      currentSum = currentSum === 0 ? 1 : currentSum * 2;
    }
  });
  sum += currentSum;
});

let cardCount = 0;
const parseCard = async ({ lotteryNumbers, myNumbers, id }: Card) => {
  cardCount += 1;
  let counts: Record<number, number> = {};
  let currentSum = 0;

  lotteryNumbers.forEach((number) => {
    if (counts[number]) {
      counts[number] = counts[number] + 1;
    } else {
      counts[number] = 1;
    }
  });

  myNumbers.forEach((number) => {
    if (counts[number]) {
      currentSum += 1;
    }
  });

  if (currentSum === 0) {
    return;
  }
  for (let i = id; i < id + currentSum; i++) {
    parseCard(cards[i]);
  }
};

cards.forEach((card) => {
  parseCard(card);
});

console.log(cardCount);
