import * as fs from 'fs';

// ===========
// == Setup ==
// ===========
const TARGET_DIR = 'csv';
const SOURCE_PATH = __dirname + '/raw-cleaned';
const TARGET_PATH = __dirname + '/' + TARGET_DIR;

const readOptions = { encoding: 'utf-8' };
const writeOptions = { encoding: 'utf-8' };

// ==========
// == Main ==
// ==========
let setosaData: string;
let virginicaData: string;
let versicolorData: string;
let combinedData: string;

prepareTargetDirectory();

setosaData = fs.readFileSync(SOURCE_PATH + '/setosa.txt', readOptions);
virginicaData = fs.readFileSync(SOURCE_PATH + '/virginica.txt', readOptions);
versicolorData = fs.readFileSync(SOURCE_PATH + '/versicolor.txt', readOptions);

setosaData = convertToCsv(setosaData, 'setosa');
virginicaData = convertToCsv(virginicaData, 'virginica');
versicolorData = convertToCsv(versicolorData, 'versicolor');
combinedData = setosaData + virginicaData + versicolorData;

fs.writeFileSync(TARGET_PATH + '/setosa.csv', setosaData, writeOptions);
fs.writeFileSync(TARGET_PATH + '/virginica.csv', virginicaData, writeOptions);
fs.writeFileSync(TARGET_PATH + '/versicolor.csv', versicolorData, writeOptions);
fs.writeFileSync(TARGET_PATH + '/all.csv', combinedData, writeOptions);

// ===============
// == Functions ==
// ===============
/**
 * This function creates a directory for storing cleaned data if it does not
 * already exist.
 * @returns {boolean} {@code true} if the target directory does not exist,
 *     {@code false} otherwise.
 */
function prepareTargetDirectory(): boolean {
  const listOfFiles = fs.readdirSync(__dirname);
  const targetDirectoryExists = !!~listOfFiles.indexOf(TARGET_DIR);

  if (!targetDirectoryExists) {
    fs.mkdirSync(TARGET_PATH);
  }
  else {
    console.error([
      '',
      'Program terminated! Target directory already exists:',
      TARGET_PATH,
      ''
    ].join('\n'));
    process.exit();
  }

  return !targetDirectoryExists;
}

/**
 * This function converts cleaned raw files into a multi-line string that is
 * CSV-formatted.
 */
function convertToCsv(data: string, species: string): string {
  const columnStrings = data.split(/[a-z\-]+\n/).filter((column) => !!column);
  const columns = columnStrings.map((str) => str.split('\n'));
  const newLines = Array.from({ length: columns[0].length }).map(() => []);

  columns.forEach((column) => {
    column.forEach((value, index) => {
      if (value) {
        newLines[index].push(value);
      }
    });
  });

  // Removed empty arrays at the end
  while(!newLines[newLines.length - 1].join('')) {
    newLines.pop();
  }

  // Append an empty array so that `,${species}\n` will also be added to the
  // last line with Array.prototype.join()
  newLines.push([]);

  return newLines.join(`,${species}\n`);
}
