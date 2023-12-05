const input = await Deno.readTextFile('./input.txt');

const lines = input.split('\n');

const sumOfCalibrationValues = lines.reduce((accumulator, line) => {
  let firstDigit;
  let lastDigit;

  for (let startIndex = 0; startIndex < line.length; startIndex++) {
    const character = line[startIndex];
    const isDigit = !isNaN(parseInt(character));

    if (isDigit) {
      firstDigit = character;
      break;
    }
  }

  for (let endIndex = line.length - 1; endIndex >= 0; endIndex--) {
    const character = line[endIndex];
    const isDigit = !isNaN(parseInt(character));

    if (isDigit) {
      lastDigit = character;
      break;
    }
  }

  if (!firstDigit || !lastDigit) {
    throw new Error('Invalid input!');
  }

  const calibrationValue = parseInt(`${firstDigit}${lastDigit}`);

  return accumulator + calibrationValue;
}, 0);

console.log(sumOfCalibrationValues);
