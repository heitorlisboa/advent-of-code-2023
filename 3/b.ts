const digitRegex = /\d/;

function getFullNumberFromAnyDigitIndex({
  column,
  schematicRow,
}: {
  column: number;
  schematicRow: string;
}) {
  let fullNumber = schematicRow[column];
  let backwardIterator = column;
  let forwardIterator = column;

  // Checking the characters on the left
  while (backwardIterator >= 0) {
    backwardIterator--;

    const character = schematicRow[backwardIterator];
    const isDigit = digitRegex.test(character);
    if (!isDigit) break;

    fullNumber = character + fullNumber;
  }

  // Checking the characters on the right
  while (forwardIterator <= schematicRow.length - 1) {
    forwardIterator++;

    const character = schematicRow[forwardIterator];
    const isDigit = digitRegex.test(character);
    if (!isDigit) break;

    fullNumber = fullNumber + character;
  }

  return parseInt(fullNumber);
}

function getAdjacentNumbers({
  column,
  row,
  schematicGrid,
}: {
  column: number;
  row: number;
  schematicGrid: string[];
}) {
  const lastColumn = schematicGrid[row].length - 1;
  const firstAdjacentColumn = column > 0 ? column - 1 : column;
  const lastAdjacentColumn = column < lastColumn ? column + 1 : column;
  const adjacentNumbers: number[] = [];

  // Checking on the left
  if (digitRegex.test(schematicGrid[row][firstAdjacentColumn])) {
    const fullNumber = getFullNumberFromAnyDigitIndex({
      column: firstAdjacentColumn,
      schematicRow: schematicGrid[row],
    });
    adjacentNumbers.push(fullNumber);
  }

  // Checking on the right
  if (digitRegex.test(schematicGrid[row][lastAdjacentColumn])) {
    const fullNumber = getFullNumberFromAnyDigitIndex({
      column: lastAdjacentColumn,
      schematicRow: schematicGrid[row],
    });
    adjacentNumbers.push(fullNumber);
  }

  // Checking the row above
  const firstDigitRegex = /(?<!\d)\d/g;
  if (row > 0) {
    const previousRow = schematicGrid[row - 1];
    const previousRowAdjacentSlice = previousRow.slice(
      firstAdjacentColumn,
      /* `.slice` is exclusive, hence the `+1` at the end to include last
      adjacent column */
      lastAdjacentColumn + 1
    );

    const digitMatchArrayIterable =
      previousRowAdjacentSlice.matchAll(firstDigitRegex);
    for (const digitMatchArray of digitMatchArrayIterable) {
      const fullNumber = getFullNumberFromAnyDigitIndex({
        column: firstAdjacentColumn + digitMatchArray.index!,
        schematicRow: previousRow,
      });
      adjacentNumbers.push(fullNumber);
    }
  }

  // Checking the row below
  const lastRow = schematicGrid.length - 1;
  if (row < lastRow) {
    const nextRow = schematicGrid[row + 1];
    const nextRowAdjacentSlice = nextRow.slice(
      firstAdjacentColumn,
      /* `.slice` is exclusive, hence the `+1` at the end to include last
      adjacent column */
      lastAdjacentColumn + 1
    );

    const digitMatchArrayIterable =
      nextRowAdjacentSlice.matchAll(firstDigitRegex);
    for (const digitMatchArray of digitMatchArrayIterable) {
      const fullNumber = getFullNumberFromAnyDigitIndex({
        column: firstAdjacentColumn + digitMatchArray.index!,
        schematicRow: nextRow,
      });
      adjacentNumbers.push(fullNumber);
    }
  }

  return adjacentNumbers;
}

const input = await Deno.readTextFile('./input.txt');
const schematicGrid = input.split('\n');
let sumOfGearRatios = 0;

for (const [rowIndex, schematicRow] of schematicGrid.entries()) {
  const starSymbolMatchArrayIterable = schematicRow.matchAll(/\*/g);
  for (const starSymbolMatchArray of starSymbolMatchArrayIterable) {
    const column = starSymbolMatchArray.index!;
    const numbersAdjacentToSymbol = getAdjacentNumbers({
      column,
      row: rowIndex,
      schematicGrid,
    });
    const isGear = numbersAdjacentToSymbol.length === 2;

    if (isGear) {
      const gearRatio = numbersAdjacentToSymbol.reduce(
        (previousValue, currentValue) => previousValue * currentValue
      );
      sumOfGearRatios += gearRatio;
    }
  }
}

console.log(sumOfGearRatios);
