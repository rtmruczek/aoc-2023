import fs from "fs";
import path from "path";

const file = fs.readFileSync(path.resolve(__dirname, "./input.txt"));

const lines = file.toString();

const MAX_BALLS = {
  blue: 14,
  red: 12,
  green: 13,
};

const result = lines.split("\n").reduce<number>((acc, game) => {
  const roundsStr = game.split(";");

  const gameId = parseInt(game.match(/Game (\d+)/).at(1));

  const roundPossibilities = roundsStr.flatMap((round) => {
    const ballsEachRound = round.split(",").map((balls) => {
      const match = balls.match(/(\d+)\s(red|blue|green)/);
      return {
        color: match[2],
        value: parseInt(match[1]),
      };
    });
    return ballsEachRound.map((balls) => {
      if (balls.value > MAX_BALLS[balls.color as keyof typeof MAX_BALLS]) {
        return "impossible";
      }
      return "possible";
    });
  });
  return !roundPossibilities.includes("impossible") ? acc + gameId : acc;
}, 0);

console.log(result);

const result2 = lines.split("\n").reduce<number>((acc, game) => {
  const roundsStr = game.split(";");

  const ballsEachRound = roundsStr.reduce(
    (highestBalls, current) => {
      current.split(",").forEach((round) => {
        const match = round.match(/(\d+)\s(red|blue|green)/);
        const value = parseInt(match[1]);
        const color = match[2] as keyof typeof highestBalls;
        if (value > highestBalls[color]) {
          highestBalls[color] = value;
        }
      });
      return highestBalls;
    },
    {
      red: 0,
      green: 0,
      blue: 0,
    }
  );

  const cubePowers =
    ballsEachRound.blue * ballsEachRound.green * ballsEachRound.red;

  return acc + cubePowers;
}, 0);

console.log(result2);
