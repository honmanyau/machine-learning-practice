import * as fs from 'fs';

// ===========
// == Setup ==
// ===========
const TARGET_DIR = 'raw-cleaned';
const SOURCE_PATH = __dirname + '/raw';
const TARGET_PATH = __dirname + '/' + TARGET_DIR;

const readOptions = { encoding: 'utf-8' };
const writeOptions = { encoding: 'utf-8' };

// ==========
// == Main ==
// ==========
let setosaData: string;
let virginicaData: string;
let versicolorData: string;

prepareTargetDirectory();

setosaData = fs.readFileSync(SOURCE_PATH + '/setosa.txt', readOptions);
virginicaData = fs.readFileSync(SOURCE_PATH + '/virginica.txt', readOptions);
versicolorData = fs.readFileSync(SOURCE_PATH + '/versicolor.txt', readOptions);

setosaData = cleanDecimalPoints(setosaData, 'setosa');
virginicaData = cleanDecimalPoints(virginicaData, 'virginica');
versicolorData = cleanDecimalPoints(versicolorData, 'versicolor');

fs.writeFileSync(TARGET_PATH + '/setosa.txt', setosaData, writeOptions);
fs.writeFileSync(TARGET_PATH + '/virginica.txt', virginicaData, writeOptions);
fs.writeFileSync(TARGET_PATH + '/versicolor.txt', versicolorData, writeOptions);

// ===============
// == Functions ==
// ===============
type Species = 'setosa' | 'virginica' | 'versicolor';

/**
 * This function replaces all symbols that should be a decimal point in.
 * @param {string} data The data read from a text file.
 * @param {("setosa"|"virginica"|"versicolor")} species The species of iris.
 * @returns {string} Data with proper decimal points.
 */
function cleanDecimalPoints(data: string, species: Species): string {
  const lines = data.split(/\r*\n/);

  lines.forEach((line, index) => {
    const lineNotEmpty = line.replace(/\s/, '').length > 0;
    const notHeader = !line.match(species);

    if (lineNotEmpty && notHeader) {
      lines[index] = line.replace(/\s/, '').replace(/[^\d]/, '.');
    }
  });

  return lines.join('\n');
}

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
