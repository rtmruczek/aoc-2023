import fs from "fs";
import path from "path";

const file = fs.readFileSync(path.resolve(__dirname, "./input.txt"));

const lines = file.toString();

interface GridCell {
  x: number;
  y: number;
  value: string;
  type: "digit" | "symbol" | "period";
}
const isNumber = (str: string) => {
  return /\d/.test(str);
};

const grid: GridCell[][] = lines.split("\n").map((line, i) => {
  return [...line].map((character, j) => {
    return {
      x: j,
      y: i,
      value: character,
      type: isNumber(character)
        ? "digit"
        : character === "."
        ? "period"
        : "symbol",
    };
  });
});

const findAtCoordinates = ({
  x,
  y,
}: {
  x: number;
  y: number;
}): GridCell | undefined => {
  if (x >= grid[0].length || x === -1) return undefined;
  if (y >= grid.length || y === -1) return undefined;
  return grid[y][x];
};

const getAdjacentCells = ({
  gridCell,
  typeToFind,
}: {
  gridCell: GridCell;
  typeToFind: GridCell["type"];
}): GridCell[] => {
  const left = findAtCoordinates({ x: gridCell.x - 1, y: gridCell.y });
  const right = findAtCoordinates({ x: gridCell.x + 1, y: gridCell.y });
  const top = findAtCoordinates({ x: gridCell.x, y: gridCell.y - 1 });
  const bottom = findAtCoordinates({ x: gridCell.x, y: gridCell.y + 1 });

  const topLeft = findAtCoordinates({ x: gridCell.x - 1, y: gridCell.y - 1 });
  const topRight = findAtCoordinates({ x: gridCell.x + 1, y: gridCell.y - 1 });
  const bottomLeft = findAtCoordinates({
    x: gridCell.x - 1,
    y: gridCell.y + 1,
  });
  const bottomRight = findAtCoordinates({
    x: gridCell.x + 1,
    y: gridCell.y + 1,
  });

  return [
    left,
    right,
    top,
    bottom,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  ].filter((gridCell) => gridCell?.type === typeToFind);
};

const result = grid.reduce<number>((accGrid, gridRow, currentIndex) => {
  let currentNumber = "";
  let isAdjacentToSymbol = false;
  let sumOfRow = 0;
  gridRow.forEach((gridCell) => {
    if (gridCell.type === "digit") {
      currentNumber = currentNumber.concat(gridCell.value);
      if (getAdjacentCells({ gridCell, typeToFind: "symbol" }).length > 0) {
        isAdjacentToSymbol = true;
      }
    } else {
      if (currentNumber.length > 0 && isAdjacentToSymbol) {
        sumOfRow += parseInt(currentNumber);
      }
      isAdjacentToSymbol = false;
      currentNumber = "";
    }
  });
  if (currentNumber.length > 0 && isAdjacentToSymbol) {
    sumOfRow += parseInt(currentNumber);
  }
  return accGrid + sumOfRow;
}, 0);

// console.log(result);

const result2 = grid.reduce<number>((accGrid, gridRow) => {
  gridRow.forEach((gridCell) => {
    if (gridCell.value === "*") {
      const adjacentDigits = getAdjacentCells({
        gridCell,
        typeToFind: "digit",
      });

      const alreadyProcessed: GridCell[] = [];
      const numbers: number[] = [];

      adjacentDigits.forEach((cell) => {
        let nextCell = { ...cell };
        let currentNumber = "";
        while (nextCell && nextCell.type === "digit") {
          nextCell = findAtCoordinates({ x: nextCell.x - 1, y: cell.y });
        }
        nextCell = findAtCoordinates({ x: nextCell?.x + 1 ?? 0, y: cell.y });
        while (nextCell && nextCell.type === "digit") {
          const findAlreadyProcessed = alreadyProcessed.find(
            (cell) => cell.x === nextCell.x && cell.y === nextCell.y
          );
          if (!findAlreadyProcessed) {
            alreadyProcessed.push(nextCell);
            currentNumber = currentNumber.concat(nextCell.value);
          }
          nextCell = findAtCoordinates({ x: nextCell.x + 1, y: cell.y });
        }
        if (currentNumber.length > 0) {
          numbers.push(parseInt(currentNumber));
        }
      });

      if (numbers.length === 2) {
        // console.log(gridCell);
        // console.log(numbers);
        const [multiplicand, multiplier] = numbers;
        const product = multiplicand * multiplier;
        accGrid += product;
        // console.log(`${multiplicand} * ${multiplier} = ${product}`);
        // console.log(accGrid);
      }
      if (numbers.length === 1) {
        console.log(gridCell);
      }
    }
  });
  return accGrid;
}, 0);

console.log(result2);
