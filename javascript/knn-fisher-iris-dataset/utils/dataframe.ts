// ==============
// == Examples ==
// ==============
// import * as fs from 'fs';
//
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
  head: (rows?: number) => void,
  print: (start?: number, end?: number) => void,
  readData: (input: string | any[][]) => void,
  select: (names: (string | number)[]) => IContainer,
  tail: (rows?: number) => void,
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
 * This function processes a CSV string or clones an array of arrays and assigns
 * the result to `this.data`.
 * @param {string} input The CSV file read into memory as a string. When
 *     the argument is a string, the {@code readCsv} method is used to attempt
 *     to parse the data; if the data is not a string, a deep copy will be
 *     created using {@code JSON.stringify} and {@code JSON.parse} and the
 *     resultant array assigned to {@code this.data}; if no argument is
 *     passed in, an "empty" container is created.
 */
function readData(input: string | any[][]): void {
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
  this.headers = this.data[0].map((value, index) => index);
}

/**
 * This function prints the specified number of row of the data in
 * {@code dataframe.data} to the console. Calling the function without providing
 * any arguments prints all rows.
 * @param {number} start The zero-based index of the entry in
 *     {@code dataframe.data} to begin printing with.
 * @param {number} end The zero-based index of the entry in
 *     {@code dataframe.data} to terminate printing with.
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
 * This function prints data starting from the first entry in
 * {@code }dataframe.data} to the console.
 * @param {number} rows The number of rows to be printed.
 */
function head(rows: number = 5): void {
  print.bind(this, 0)(rows);
}

/**
 * This function prints the last few rows of, and always ending with the last
 * row in, {@code dataframe.data} to the console.
 * @param {number} rows The number of rows to be printed.
 */
function tail(rows: number = 5): void {
  print.bind(this)(this.data.length - rows);
}

/**
 * This function selects the column with the column heading(s) or index/indices
 * given and returns a data object containing those columns.
 * @param {string[]|number[]} headers An array of column headings or indices.
 * @returns {{}} A data container object with only the selected columns.
 */
function select(headers: (string | number)[]): IContainer {
  const indices = convertToIndices(headers, this.headers);
  const newContainer = createContainer(this.data);
  const filterByIndex = (value, index) => ~indices.indexOf(index);
  const newHeaders = this.headers.filter(filterByIndex);
  const newData = newContainer.data.map((row) => row.filter(filterByIndex));

  newContainer.data = newData;
  newContainer.headers = newHeaders;

  return newContainer;
}

/**
 * This function creates a new dataframe that contains only the data with the
 * grouping conditions provided.
 * @param {string[]} headers The column indices or strings that that correspond
 *     to those found in {@code dataframe.headers}.
 * @param {string[]} features The values of the features in each of the columns
 *     specified in headers to to be matched
 * @returns {IContainer}
 */
function groupBy(headers: (string | number)[], features: any[]): IContainer {
  const indices = convertToIndices(headers, this.headers);
  const newContainer = createContainer(this.data);

  newContainer.headers = [...this.headers];
  newContainer.data = newContainer.data.filter((row) => (
    features.reduce((acc, feature, index) => {
      const reference = row[indices[index]];

      return acc && feature === reference;
    }, true)
  ));

  return newContainer;
}

/**
 * This function returns an array of features for each of the columns in
 * {@code this.data}.
 * @returns {{}} An object of which each property corresponds to a header in
 *     {@code dataframe.headers} and its values is an array of the corresponding
 *     values in {@code dataframe.data}.
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
 * Creates a summary of the statistics of numeric data in the dataframe, which
 * is printed to the console as a table and returned as a object for further
 * manipulation. The metrics reported are count, mean, variance, standard
 * deviation, minimum value, and maximum value.
 * @param {number} dp The number of decimal places to be rounded to internally
 *     using {@code Number.prototype.toFixed()}. The output observed in the
 *     console may be less than the number of decimal places specified since the
 *     string produced by {@code toFixed()} is converted back to a number using
 *     {@code }Number()}.
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
 * header indices.
 * @param {(string | number)[]} headers An array of values to be converted to
 *     header indices.
 * @param {(string | number)[]} reference An array of values to be converted to
 *     header indices.
 * @returns {number[]} An array of header indices
 */
function convertToIndices(
  headers: (string | number)[], reference: (string | number)[]
): number[] {
  const indices = headers.map((header) => (
    typeof header === 'number' && Number.isInteger(header) ?
      header :
      reference.indexOf(header)
  ));

  if (indices.reduce((acc, index) => acc || !reference[index], false)) {
    throw new Error(`Invalid index or header found in ${headers}.`);
  };

  return indices;
}
