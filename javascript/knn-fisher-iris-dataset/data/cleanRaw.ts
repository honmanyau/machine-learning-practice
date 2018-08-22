import * as fs from 'fs';

// ===========
// == Setup ==
// ===========
const targetDirName = '/raw-cleaned';
const sourceDirPath = __dirname + '/raw';
const targetDirPath = __dirname + targetDirName;

const readOptions = { encoding: 'utf-8' };
const writeOptions = { encoding: 'utf-8' };

const listOfFiles = fs.readdirSync(__dirname);
const targetDirectoryExists = !!~listOfFiles.indexOf(targetDirName);

// ==========
// == Main ==
// ==========
let setosaData: string;
let virginicaData: string;
let versicolorData: string;

setosaData = fs.readFileSync(sourceDirPath + '/setosa.txt', readOptions);
virginicaData = fs.readFileSync(sourceDirPath + '/virginica.txt', readOptions);
versicolorData = fs.readFileSync(sourceDirPath + '/versicolor.txt', readOptions);

setosaData = cleanDecimalPoints(setosaData, 'setosa');
virginicaData = cleanDecimalPoints(virginicaData, 'virginica');
versicolorData = cleanDecimalPoints(versicolorData, 'versicolor');

if (!targetDirectoryExists) {
  fs.mkdirSync(targetDirPath);
}

fs.writeFileSync(targetDirPath + '/setosa', setosaData, writeOptions);
fs.writeFileSync(targetDirPath + '/virginica', virginicaData, writeOptions);
fs.writeFileSync(targetDirPath + '/versicolor', versicolorData, writeOptions);

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
      lines[index] = line.replace(/[^\d]/, '.');
    }
  });

  return lines.join('\n');
}
