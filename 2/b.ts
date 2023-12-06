type CubeColor = 'red' | 'green' | 'blue';

function parseGame(game: string) {
  const [
    // Example: 'Game 1'
    gameTitle,
    // Example: '3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
    setOfCubesAsString,
  ] = game.split(': ');

  const gameId = parseInt(gameTitle.split(' ')[1]);

  const setOfCubes = setOfCubesAsString
    .split('; ')
    .map((/** @example '3 blue, 4 red' */ subsetOfCubesAsString) => {
      const subsetOfCubes = subsetOfCubesAsString
        .split(', ')
        .map((/** @example '3 blue' */ cubeCountAndColorAsString) => {
          const [cubeCount, cubeColor] = cubeCountAndColorAsString.split(
            ' '
          ) as [`${number}`, CubeColor];

          return { color: cubeColor, count: parseInt(cubeCount) };
        });

      return subsetOfCubes;
    });

  return { gameId, setOfCubes };
}

const input = await Deno.readTextFile('./input.txt');
const games = input.split('\n');

const sumOfCubeSetPowers = games.reduce((accumulator, game) => {
  const { setOfCubes } = parseGame(game);

  const mininumNumberOfCubesInsideBag = { red: 0, green: 0, blue: 0 };

  for (const subsetOfCubes of setOfCubes) {
    for (const cubeInfo of subsetOfCubes) {
      if (cubeInfo.count > mininumNumberOfCubesInsideBag[cubeInfo.color]) {
        mininumNumberOfCubesInsideBag[cubeInfo.color] = cubeInfo.count;
      }
    }
  }

  const cubeSetPower = Object.values(mininumNumberOfCubesInsideBag).reduce(
    (previousValue, currentValue) => previousValue * currentValue
  );

  return accumulator + cubeSetPower;
}, 0);

console.log(sumOfCubeSetPowers);
