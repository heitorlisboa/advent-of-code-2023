type NumberSpelledWithLetters = keyof typeof valuesOfNumbersSpelledWithLetters;

const valuesOfNumbersSpelledWithLetters = {
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

const numberRegex = /(?=(one|two|three|four|five|six|seven|eight|nine|[1-9]))/g;

const input = await Deno.readTextFile('./input.txt');

const lines = input.split('\n');

const sumOfCalibrationValues = lines.reduce((accumulator, line) => {
  const matchArrayIterable = line.matchAll(numberRegex) || [];
  const digits = Array.from(matchArrayIterable).map(([, group]) => group);
  const lastDigitIndex = digits.length - 1;

  const firstDigitAsNumber =
    valuesOfNumbersSpelledWithLetters[digits[0] as NumberSpelledWithLetters] ??
    parseInt(digits[0]);
  const lastDigitAsNumber =
    valuesOfNumbersSpelledWithLetters[
      digits[lastDigitIndex] as NumberSpelledWithLetters
    ] ?? parseInt(digits[lastDigitIndex]);

  const calibrationValue = parseInt(
    `${firstDigitAsNumber}${lastDigitAsNumber}`
  );

  return accumulator + calibrationValue;
}, 0);

console.log(sumOfCalibrationValues);
