function checkForAdjacentSymbol({
  startingColumn,
  endingColumn,
  row,
  schematicGrid,
}: {
  startingColumn: number;
  endingColumn: number;
  row: number;
  schematicGrid: string[];
}) {
  const symbolRegex = /[^0-9.]/;
  const lastColumn = schematicGrid[row].length - 1;
  const firstAdjacentColumn =
    startingColumn > 0 ? startingColumn - 1 : startingColumn;
  const lastAdjacentColumn =
    endingColumn < lastColumn ? endingColumn + 1 : endingColumn;

  // Checking on the left
  if (symbolRegex.test(schematicGrid[row][firstAdjacentColumn])) {
    return true;
  }

  // Checking on the right
  if (symbolRegex.test(schematicGrid[row][lastAdjacentColumn])) {
    return true;
  }

  // Checking the row above
  if (row > 0) {
    const previousRow = schematicGrid[row - 1];
    const previousRowAdjacentSlice = previousRow.slice(
      firstAdjacentColumn,
      /* `.slice` is exclusive, hence the `+1` at the end to include last
      adjacent column */
      lastAdjacentColumn + 1
    );

    if (symbolRegex.test(previousRowAdjacentSlice)) {
      return true;
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

    if (symbolRegex.test(nextRowAdjacentSlice)) {
      return true;
    }
  }

  return false;
}

const input = await Deno.readTextFile('./input.txt');
const schematicGrid = input.split('\n');
let sumOfEnginePartNumbers = 0;

for (const [rowIndex, schematicRow] of schematicGrid.entries()) {
  const numberMatchArrayIterable = schematicRow.matchAll(/\d+/g);
  for (const numberMatchArray of numberMatchArrayIterable) {
    const number = parseInt(numberMatchArray[0]);
    const startingColumn = numberMatchArray.index!;
    const endingColumn = startingColumn + numberMatchArray[0].length - 1;
    const isPartNumber = checkForAdjacentSymbol({
      startingColumn,
      endingColumn,
      row: rowIndex,
      schematicGrid,
    });

    if (isPartNumber) {
      sumOfEnginePartNumbers += number;
    }
  }
}

console.log(sumOfEnginePartNumbers);
