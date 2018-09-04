// ==============
// == Examples ==
// ==============
// import * as fs from 'fs';
//
// const csv = fs.readFileSync(__dirname + '/test-data/all.csv', 'utf-8');
// const iris = createDataframe(csv);
//
// iris.headers = [
//   'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
// ];
//
// iris.describe();
//
// const setosa = iris.filter({ Species: 'setosa' });
// const virginica = iris.filter({ Species: 'virginica' });
// const versicolor = iris.filter({ Species: 'versicolor' });
//
// setosa.describe();
// virginica.describe();
// versicolor.describe();
//
// setosa.describe();
// setosa.standardise();
// setosa.describe();
// setosa.destandardise();
// setosa.describe();

// =============
// == Exports ==
// =============
export { createDataframe };

// ================
// == Interfaces ==
// ================
interface IDataframe {
  headers: string[];
  data: any[][];
  standardised: boolean;
  destandardisers?: Array<((feature: number) => number) | undefined>;
  // Methods
  clone: () => IDataframe;
  describe: (dp?: number | false) => object;
  destandardise: () => void;
  filter: <T extends object>(filters: T) => IDataframe;
  head: (rows?: number) => void;
  print: (start?: number, end?: number) => void;
  readData: (input: string | any[][]) => void;
  replace: (header: string, dictionary: object) => void;
  select: (headers: Array<string | number>) => IDataframe;
  shuffle: () => void;
  standardise: () => void;
  tail: (rows?: number) => void;
  transpose: () => object;
}

// ===============
// == Functions ==
// ===============
/**
 * This function creates a dataframe object with the given data.
 * @param {string|any[][]} data Data to be assigned to {@code this.data.columns}.
 *     When the argument is a string, the {@code readCsv} method is used to
 *     attempt to parse the data; if the data is not a string, a deep copy will
 *     be created using {@code JSON.stringify} and {@code JSON.parse} and the
 *     resultant array assigned to {@code this.data}; if no argument is
 *     passed in, an "empty" dataframe is created.
 * @returns {IDataframe} A dataframe object.
 */
function createDataframe(input: string | any[][] = [[]]): IDataframe {
  const dataframe: IDataframe = {
    headers: [],
    data: [[]],
    standardised: false,
    destandardisers: undefined,
    // Methods
    clone,
    describe,
    destandardise,
    filter,
    head,
    print,
    readData,
    replace,
    select,
    shuffle,
    standardise,
    tail,
    transpose
  };

  dataframe.readData(input);

  return dataframe;
}

/**
 * This function processes a CSV string or clones an array of arrays and assigns
 * the result to `this.data`.
 * @param {string} input The CSV file read into memory as a string. When
 *     the argument is a string, the {@code readCsv} method is used to attempt
 *     to parse the data; if the data is not a string, a deep copy will be
 *     created using {@code JSON.stringify} and {@code JSON.parse} and the
 *     resultant array assigned to {@code this.data}; if no argument is
 *     passed in, an "empty" dataframe is created.
 */
function readData(this: IDataframe, input: string | any[][]): void {
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
  this.headers = this.data[0].map((value: any, index: number) => String(index));
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
function print(this: IDataframe, start: number = 0, end?: number): void {
  const len = arguments.length;
  const data = this.data.slice(...(len < 2 ? [start] : [start, end]));

  if (!this.headers) {
    return console.table(data);
  }

  const formattedData = data.map((row: any[]) => {
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
function head(this: IDataframe, rows: number = 5): void {
  print.bind(this, 0)(rows);
}

/**
 * This function prints the last few rows of, and always ending with the last
 * row in, {@code dataframe.data} to the console.
 * @param {number} rows The number of rows to be printed.
 */
function tail(this: IDataframe, rows: number = 5): void {
  print.bind(this)(this.data.length - rows);
}

/**
 * This function selects the column with the column heading(s) or index/indices
 * given and returns a new data object containing those columns.
 * @param {string[]|number[]} headers An array of column headings or indices.
 * @returns {object} A data dataframe object with only the selected columns.
 */
function select(this: IDataframe, headers: Array<string | number>): IDataframe {
  const indices = convertToIndices(headers, this.headers);
  const newDataframe = createDataframe(this.data);
  const filterByIndex = (value: string, index: number) => ~indices.indexOf(index);
  const newHeaders = this.headers.filter(filterByIndex);
  const newData = newDataframe.data.map((row) => row.filter(filterByIndex));

  newDataframe.data = newData;
  newDataframe.headers = newHeaders;

  return newDataframe;
}

/**
 * This function creates a new dataframe that contains only the data with the
 * grouping conditions provided.
 * @param {conditions} headers An object whose keys are headers of the columns
 *     to be filtered and values are the values to filter with.
 * @returns {IDataframe} A new dataframe containing only entries that meet the
 *     the filter conditions.
 */
function filter<T extends object>(this: IDataframe, conditions: T): IDataframe {
  const headers = Object.keys(conditions);
  const newDataframe = createDataframe(this.data);

  newDataframe.headers = [...this.headers];
  newDataframe.data = newDataframe.data.filter((row) => (
    headers.reduce((acc, header) => {
      const feature = conditions[header];
      const reference = row[this.headers.indexOf(header)];

      return acc && feature === reference;
    }, true)
  ));

  return newDataframe;
}

/**
 * This function returns an array of features for each of the columns in
 * {@code this.data}.
 * @returns {object} An object of which each property corresponds to a header in
 *     {@code dataframe.headers} and its values is an array of the corresponding
 *     values in {@code dataframe.data}.
 */
function transpose(this: IDataframe): object {
  const transposed = {};
  const { headers, data } = this;

  headers.forEach((header: string) => {
    if (!transposed[header]) {
      transposed[header] = [];
    }
  });

  data.forEach((row: any[]) => {
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
 * @param {number | false} dp The number of decimal places to be rounded to
 *     internally using {@code Number.prototype.toFixed()}. The output observed
 *     in the console may be less than the number of decimal places specified
 *     since the string produced by {@code toFixed()} is converted back to a
 *     number using {@code }Number()}. If {@code false} is given, no rounding
 *     will occur.
 * @return {object} A object containing details of the summary.
 */
function describe(this: IDataframe, dp: number | false = 4): object {
  // Columns that are not numeric will be undefined, which is used as a flag
  // below to avoid data processing.
  const summary = this.data[0].map((value: any) => {
    if (typeof value === 'number') {
      return {
        count: 0,
        sum: 0,
        mean: 0,
        squaredDeviationFromMean: 0,
        variance: -1,
        sd: -1,
        min: value,
        max: value
      };
    }
    else {
      return undefined;
    }
  });
  const summaryObject = {};

  // Calculate the sum and count of each column
  for (const row of this.data) {
    for (let featureIndex = 0; featureIndex < row.length; featureIndex++) {
      const column = summary[featureIndex];
      const feature = row[featureIndex];

      if (column) {
        column.sum += feature;
        column.count += 1;
      }
    }
  }

  // Calculate the mean of each column
  for (const column of summary) {
    if (column) {
      column.mean = column.sum / column.count;
    }
  }

  // Calculate the min and max of each column
  for (const row of this.data) {
    for (let featureIndex = 0; featureIndex < row.length; featureIndex++) {
      const column = summary[featureIndex];

      if (column) {
        const feature = row[featureIndex];
        const { mean, min, max } = column;

        column.squaredDeviationFromMean += Math.pow(feature - mean, 2);
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
        const feature = column[key];
        const round = (dp || dp === 0) && Number.isInteger(dp);

        column[key] = round ? Number(feature.toFixed(dp)) : feature;
      });

      summaryObject[header] = column;
    }
  }

  console.table(summaryObject);

  return summaryObject;
}

/**
 * This function creates a new dataframe object with features scaled to have
 * close to (as close as possible) zero mean and unit variance. The standardised
 * value is caculated using the formula {@code x' = (x - μ) / σ}, Where
 * {@code x'} is the scaled value, {@code x} the initial value, {@code μ} the
 * sample mean, and {@code σ} the sample standard deviation.
 * @returns {IDataframe} A new dataframe object with standardised columns.
 */
function standardise(this: IDataframe): void {
  if (this.standardised) {
    throw new Error('Data already standardised!');
  }

  const stats = disableConsole('table', () => this.describe(false));

  this.data.forEach((row: number[], rowIndex: number) => {
    row.forEach((feature: number, featureIndex: number) => {
      const header = this.headers[featureIndex];

      if (stats[header]) {
        const mean = stats[header].mean;
        const sd = stats[header].sd;

        this.data[rowIndex][featureIndex] = (feature - mean) / sd;
      }
    });
  });

  this.standardised = true;
  this.destandardisers = this.headers.map((header) => {
    let destandardiser;

    if (stats[header]) {
      const mean = stats[header].mean;
      const sd = stats[header].sd;

      destandardiser = (value: number) => value * sd + mean;
    }

    return destandardiser;
  });
}

/**
 * This function is an implementation of the Durstenfeld shuffle algorithm for
 * shuffling the entries in {@code dataframe.data}.
 */
function shuffle(this: IDataframe): void {
  // Reference: https://stackoverflow.com/questions/2450954/how-to-randomize
  // -shuffle-a-javascript-array/12646864
  for (let i = this.data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  }
}

/**
 * This function creates a copy of a dataframe.
 * @returns {IDataframe} A dataframe with deep-cloned data and headers.
 */
function clone(this: IDataframe): IDataframe {
  const newDataframe = createDataframe(this.data);

  newDataframe.headers = [...this.headers];
  newDataframe.standardised = this.standardised;
  newDataframe.destandardisers = this.destandardisers;

  return newDataframe;
}

/**
 * This function replaces the string values in a given column according to the
 * dictionary provided.
 * @param {string} header The header of the column to operate on.
 * @param {object} dictionary The dictionary containing the origina values as
 *     keys and the new values as values.
 */
function replace(this: IDataframe, header: string, dictionary: object): void {
  const headerIndex = this.headers.indexOf(header);

  this.data.forEach((row) => {
    row.forEach((feature, featureIndex) => {
      if (featureIndex === headerIndex) {
        row[headerIndex] = dictionary[feature];
      }
    });
  });
}

/**
 * This function reverts the changes made by the {@code standardise} method.
 */
function destandardise(this: IDataframe): void {
  if (!this.standardised) {
    throw new Error('Dataframe has not been standardised!');
  }

  this.data.forEach((row: number[], rowIndex: number) => {
    row.forEach((feature: number, featureIndex: number) => {
      const destandardiser = (this.destandardisers as any[])[featureIndex];

      if (destandardiser) {
        this.data[rowIndex][featureIndex] = destandardiser(feature);
      }
    });
  });

  this.standardised = false;
  this.destandardisers = undefined;
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
  headers: Array<string | number>, reference: Array<string | number>
): number[] {
  const indices = headers.map((header) => (
    typeof header === 'number' && Number.isInteger(header) ?
      header :
      reference.indexOf(header)
  ));

  if (indices.reduce((acc, index) => acc || !reference[index], false)) {
    throw new Error(`Invalid index or header found in ${headers}.`);
  }

  return indices;
}

/**
 * Temporarily disable a particular console method for a function.
 */
function disableConsole(type: string, callback: () => any): any {
  const ref = console[type];

  if (!ref) {
    throw new Error(`console.${type} is not a valid method!`);
  }

  Object.defineProperty(console, type, {
    get() {
      return () => null;
    }
  });

  const returnValue = callback();

  Object.defineProperty(console, type, {
    get() {
      return ref;
    }
  });

  return returnValue;
}
