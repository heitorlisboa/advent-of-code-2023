type CubeColor = keyof typeof numberOfCubesInsideBag;

const numberOfCubesInsideBag = { red: 12, green: 13, blue: 14 } as const;

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

const sumOfIdsOfPossibleGames = games.reduce((accumulator, game) => {
  const { gameId, setOfCubes } = parseGame(game);

  for (const subsetOfCubes of setOfCubes) {
    for (const cubeInfo of subsetOfCubes) {
      const numberOfCubesOfCurrentColorInsideBag =
        numberOfCubesInsideBag[cubeInfo.color];
      const gameIsImpossible =
        cubeInfo.count > numberOfCubesOfCurrentColorInsideBag;

      if (gameIsImpossible) {
        // When the game is impossible, we don't add its ID
        return accumulator;
      }
    }
  }

  return accumulator + gameId;
}, 0);

console.log(sumOfIdsOfPossibleGames);
