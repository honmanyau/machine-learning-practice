import * as fs from 'fs';

// =============
// == Example ==
// =============
// const csv = fs.readFileSync(__dirname + '/test-data/all.csv', 'utf-8');
// const iris = createContainer(csv);
//
// iris.headers = [
//   'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
// ];
//
// const setosa = iris.groupBy(['Species'], ['setosa']);
// const virginica = iris.groupBy(['Species'], ['virginica']);
// const versicolor = iris.groupBy(['Species'], ['versicolor']);
//
// setosa.describe();
// virginica.describe();
// versicolor.describe();

// =============
// == Exports ==
// =============
export { Container, createContainer };

// ================
// == Interfaces ==
// ================
interface IContainer {
  headers: string[],
  data: any[][],
  describe: (dp?: number) => {},
  groupBy: (headers: (string | number)[], features: any[]) => IContainer,
  head: () => void,
  print: () => void,
  readData: (input: string | any[][]) => any[][],
  select: (names: (string | number)[]) => IContainer,
  tail: () => void,
  transpose: () => {}
};

// ===============
// == Functions ==
// ===============
/**
 * This constructor function creats a new data container object.
 * @param {string|any[][]} input Data to be assigned to this.data.columns. When
 *     the argument is a string, the {@code readCsv} method is used to attempt
 *     to parse the data; if the data is not a string, a deep copy will be
 *     created using {@code JSON.stringify} and {@code JSON.parse} and the
 *     resultant array assigned to {@code this.data}; if no argument is
 *     passed in, an "empty" container is created.
 */
function Container(input: string | any[][] = null): void {
  this.headers = null;
  this.data = null;
  // Methods
  this.describe = describe;
  this.groupBy = groupBy;
  this.head = head;
  this.print = print;
  this.readData = readData;
  this.select = select;
  this.tail = tail;
  this.transpose = transpose;

  this.readData(input);
}

/**
 * This function is a non-constructor version of of {@code Container}.
 * @param {string|any[][]} data Data to be assigned to this.data.columns. When
 *     the argument is a string, the {@code readCsv} method is used to attempt
 *     to parse the data; if the data is not a string, a deep copy will be
 *     created using {@code JSON.stringify} and {@code JSON.parse} and the
 *     resultant array assigned to {@code this.data}; if no argument is
 *     passed in, an "empty" container is created.
 * @returns {{}} A data container object.
 */
function createContainer(input: string | any[][] = null): IContainer {
  const container: IContainer = {
    headers: null,
    data: null,
    describe,
    groupBy,
    head,
    print,
    readData,
    select,
    tail,
    transpose
  };

 container.readData(input);

 return container;
}

/**
 * This function reads a CSV file and converts it into an array of arrays, where
 * each subarray corresponds to a column in the data and assign the array to
 * the {@code data} property of `this`.
 * @param {string} input The CSV file read into memory as a string. When
 *     the argument is a string, the {@code readCsv} method is used to attempt
 *     to parse the data; if the data is not a string, a deep copy will be
 *     created using {@code JSON.stringify} and {@code JSON.parse} and the
 *     resultant array assigned to {@code this.data}; if no argument is
 *     passed in, an "empty" container is created.
 * @returns {{}} A data container object.
 * @returns {any[][]} An array of arrays where each subsrray where each subarray
 *     corresponds to a column in the data
 */
function readData(input: string | any[][]): any[][] {
  let data: any[][];

  if (typeof input === 'string') {
    const lines = input.replace(/\r*\n$/, '').split('\n');

    data = lines.map((line) => {
      const row: any[] = line.split(',');

      row.forEach((value, index) => {
        const valueNotEmpty = value.replace(/\s/, '') !== '';
        const type = typeof value;
        const isStringOrNumber = type === 'string' || type === 'number';
        const numericValue = valueNotEmpty && isStringOrNumber && Number(value);

        row[index] = numericValue ? numericValue : value;
      });

      return row;
    });
  }
  else {
    data = JSON.parse(JSON.stringify({ data: input })).data;
  }

  this.data = data;

  return data;
}

/**
 * This function prints the entire dataset to the console formatted as a table.
 * @param {number} start The zero-based index of the row in the dataset to
 *     be parsed as the first row of the table (not including headers).
 * @param {number} end The zero-based index of the row in the dataset that
 *     the parsing will terminate at (not inclusive).
 */
function print(start: number = 0, end?: number): void {
  const len = arguments.length;
  const data = this.data.slice(...(len < 2 ? [start] : [start, end]));

  if (!this.headers) {
    return console.table(data);
  }

  const formattedData = data.map((row) => {
    const printableRow = {};

    row.forEach((value, index) => {
      const header = this.headers[index];

      printableRow[header] = value;
    });

    return printableRow;
  });

  return console.table(formattedData, this.headers);
}

/**
 * This function is a restricted version of {@code print} that always start with
 * the 0th row in the dataset.
 * @param {number} n The number of rows to be printed.
 */
function head(n: number = 5): void {
  print.bind(this, 0)(n);
}

/**
 * This function is a restricted version of {@code print} that start at the
 * {@code l - n}th row of the dataset, where l is the total number of records.
 * @param {number} n The number of rows to be printed.
 */
function tail(n: number = 5): void {
  print.bind(this)(this.data.length - n);
}

/**
 * This function selects the column with the column heading(s) or index/indicies
 * given and returns a data object containing those columns.
 * @param {string[]|number[]} headers An array of column headings or indicies.
 * @returns {{}} A data container object with only the selected columns.
 */
function select(headers: (string | number)[]): IContainer {
  const indicies = convertToIndicies(headers, this.headers);
  const newContainer = createContainer(this.data);
  const filterByIndex = (value, index) => ~indicies.indexOf(index);
  const newHeaders = this.headers.filter(filterByIndex);
  const newData = newContainer.data.map((row) => row.filter(filterByIndex));

  newContainer.data = newData;
  newContainer.headers = newHeaders;

  return newContainer;
}

/**
 * This function returns a new container containing all records that match the
 * given header and feature.
 * @param {string[]} headers The headers of the columns to be used.
 * @param {string[]} features The features belonging to the corresponding
 *     column to be matched.
 * @returns {IContainer}
 */
function groupBy(headers: (string | number)[], features: any[]): IContainer {
  const indicies = convertToIndicies(headers, this.headers);
  const newContainer = createContainer(this.data);

  newContainer.headers = [...this.headers];
  newContainer.data = newContainer.data.filter((row) => (
    features.reduce((acc, feature, index) => {
      const reference = row[indicies[index]];

      return acc && feature === reference;
    }, true)
  ));

  return newContainer;
}

/**
 * This function returns an array of features for each of the columns in the
 * data.
 * @returns {{}} An object in which each property corresponds to a header and
 *     its values is an array of features.
 */
function transpose(): {} {
  const transposed = {};
  const { headers, data } = this;

  headers.forEach((header) => {
    if (!transposed[header]) {
      transposed[header] = [];
    }
  });

  data.forEach((row) => {
    row.forEach((feature, index) => {
      transposed[headers[index]].push(feature);
    });
  });

  return transposed;
}

/**
 * Create a statistics summary of the data in a container, log the result to the
 * console as a table and return the summary as an object.
 * @param {number} dp Decimal points the data to be rounded off to.
 * @return {{}}
 */
function describe(dp: number = 2): {} {
  const summary = this.data[0].map((value) => {
    if (typeof value === 'number') {
      return {
        count: 0,
        sum: 0,
        mean: 0,
        squaredDeviationFromMean: 0,
        variance: null,
        sd: null,
        min: value,
        max: value
      };
    }
  });
  const summaryObject = {};

  // Calculate the sum and count of each column
  for (let rowIndex = 0; rowIndex < this.data.length; rowIndex++) {
    const row = this.data[rowIndex];

    for (let featureIndex = 0; featureIndex < row.length; featureIndex++) {
      const column = summary[featureIndex];
      const feature = row[featureIndex];

      if (column) {
        column.sum += feature;
        column.count += 1
      }
    }
  }

  // Calculate the mean of each column
  for (let summaryIndex = 0; summaryIndex < summary.length; summaryIndex++) {
    const column = summary[summaryIndex];

    if (column) {
      column.mean = column.sum / column.count;
    }
  }

  // Calculate the min and max of each column
  for (let rowIndex = 0; rowIndex < this.data.length; rowIndex++) {
    const row = this.data[rowIndex];

    for (let featureIndex = 0; featureIndex < row.length; featureIndex++) {
      const column = summary[featureIndex];

      if (column) {
        const feature = row[featureIndex];
        const { mean, min, max } = column;

        column.squaredDeviationFromMean = Math.pow(feature - mean, 2);
        column.min = feature < min ? feature : min;
        column.max = feature > max ? feature : max;
      }
    }
  }

  // Calculate the sample variance and sample SD of each column
  for (let summaryIndex = 0; summaryIndex < summary.length; summaryIndex++) {
    const column = summary[summaryIndex];
    const header = this.headers ? this.headers[summaryIndex] : summaryIndex + '';

    if (column) {
      const { count, squaredDeviationFromMean } = column;

      column.variance = squaredDeviationFromMean / (count - 1);
      column.sd = Math.sqrt(column.variance);

      // Cleanup
      delete column.sum;
      delete column.squaredDeviationFromMean;

      Object.keys(column).forEach((key) => {
        column[key] = Number(column[key].toFixed(dp));
      });

      summaryObject[header] = column;
    }
  }

  console.table(summaryObject);

  return summaryObject;
}

// ======================
// == Helper Functions ==
// ======================
/**
 * This function attempts to convert an array of values into an array of
 * header indicies.
 * @param {(string | number)[]} headers An array of values to be converted to
 *     header indicies.
 * @param {(string | number)[]} reference An array of values to be converted to
 *     header indicies.
 * @returns {number[]} An array of header indicies
 */
function convertToIndicies(
  headers: (string | number)[], reference: (string | number)[]
): number[] {
  const indicies = headers.map((header) => (
    typeof header === 'number' && Number.isInteger(header) ?
      header :
      reference.indexOf(header)
  ));

  if (indicies.reduce((acc, index) => acc || !reference[index], false)) {
    throw new Error(`Invalid index or header found in ${headers}.`);
  };

  return indicies;
}
