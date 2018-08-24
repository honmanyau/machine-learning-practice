# KNN Classification of Fisher's Iris Dataset

## Table of Contents

* [Introduction](#introduction)
* [Dataset](#dataset)
* [Data Preparation](#data-preparation)
  * [Manual Cleaning](#manual-cleaning)
  * [Automated Cleaning](#automated-cleaning)
  * [Converting to CSV Format](#converting-to-csv-format)
* [Documentation for dataframe.ts](#documentation-for-dataframets)

## Introduction

This is a classification exercise using [Ronald Fisher's iris flower dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set) and the KNN algorithm. It is based on the methodologies described in [this Jupyter notebook](https://github.com/MicrosoftLearning/Principles-of-Machine-Learning-Python/blob/master/Module1/IntroductionToMachineLearning.ipynb) in module 1 of [Microsoft Learning's Principle of Machine Learning—Python](https://github.com/MicrosoftLearning/Principles-of-Machine-Learning-Python).

## Dataset

The dataset obtained from the [original paper](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1469-1809.1936.tb02137.x) by Fisher (R. A. Fisher, *Annals of Eugenics*, **1936**, *7*, 179).

## Data Preparation

While the dataset is already widely available in various format, the data used in this exercise was extracted directly from the [1936 paper](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1469-1809.1936.tb02137.x) for practice.

### Manual Cleaning

The relevant columns for each iris species was first copied into separate text files (see `/data/raw`). Due to imperfect character recognition, manual cleanup of small inconsistencies was performed:

* The heading of each column was changed into a slug format
* Missing decimal points were added
* Values that were split into two lines were fixed
* One case of `0` copied as `o` was rectified
* The columns were checked to be correctly copied for each species by checking the the first and last few numbers of each column

[Raw data](https://github.com/honmanyau/machine-learning-practice/tree/master/javascript/knn-fisher-iris-dataset/data/raw)

### Automated Cleaning

Since some of the the decimal points were not correct copied initially, the cleaning was automated as follows:

1. Find non-empty lines that are not headers in each of the raw data files
2. Ensure that the second character, which is always a decimal point, is the `.` character

The cleaned raw data can be found in [/data/raw-cleaned](https://github.com/honmanyau/machine-learning-practice/tree/master/javascript/knn-fisher-iris-dataset/data/raw-cleaned) and the corresponding code can be found in [/data/clean-raw.ts](https://github.com/honmanyau/machine-learning-practice/blob/master/javascript/knn-fisher-iris-dataset/data/clean-raw.ts).

### Converting to CSV Format

While the CSV format is strictly not required in this case (and that CSV files for this dataset is already widely available), it is usually good practice to make data available to others in a widely used and workable format.

The format to be converted to is as follows:

```
sepal_length, sepal_width, petal_length, petal_width, species
```

The CSV files can be found in [/data/csv](https://github.com/honmanyau/machine-learning-practice/tree/master/javascript/knn-fisher-iris-dataset/data/csv) and the corresponding code can be found in [/data/convert-raw-to-csv.ts](https://github.com/honmanyau/machine-learning-practice/blob/master/javascript/knn-fisher-iris-dataset/data/convert-raw-to-csv.ts).

### Converting CSV Data to Array

Given a CSV file that is loaded into memory as a string, the conversion of that string into an array of arrays that can be used for further manipulation using JavaScript can be achieved simply using the following code:

```javascript
csvString.split(/\r*\n/).map((line) => line.split(','));
```

A utility that produces a data container with methods for visualising (in the console) and performing basic analyses and manipulation was written and can be found in [utils/dataframe.ts](https://github.com/honmanyau/machine-learning-practice/blob/master/javascript/knn-fisher-iris-dataset/utils/dataframe.ts).

## Documentation for dataframe.ts

The dataframe utility is a crude reinvention of some of the functionalities commonly found in other data processing packages. **There are currently little to no error-checking facilities in these methods**.

### Usage

The dataframe utility provides two functions, `Container` and `createContainer`, for creating a dataframe object. The only difference between the two is that `Container` is a constructor function that requires the use of the `new` keyword and `createContainer` does not; the object that both method produce is functionally identical:

```javascript
import { Container, createContainer } from './utils/dataframe';

const csv = '1,2,3\n4,5,6\n7,8,9\n';
const dataArray = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

let dataframe;

dataframe = new Container(csv);
dataframe.print();

// ┌─────────┬───┬───┬───┐
// │ (index) │ 0 │ 1 │ 2 │
// ├─────────┼───┼───┼───┤
// │    0    │ 1 │ 2 │ 3 │
// │    1    │ 4 │ 5 │ 6 │
// │    2    │ 7 │ 8 │ 9 │
// └─────────┴───┴───┴───┘

dataframe = createContainer(csv);
dataframe.print();

// ┌─────────┬───┬───┬───┐
// │ (index) │ 0 │ 1 │ 2 │
// ├─────────┼───┼───┼───┤
// │    0    │ 1 │ 2 │ 3 │
// │    1    │ 4 │ 5 │ 6 │
// │    2    │ 7 │ 8 │ 9 │
// └─────────┴───┴───┴───┘

dataframe = new Container(dataArray);
dataframe.print();

// ┌─────────┬───┬───┬───┐
// │ (index) │ 0 │ 1 │ 2 │
// ├─────────┼───┼───┼───┤
// │    0    │ 1 │ 2 │ 3 │
// │    1    │ 4 │ 5 │ 6 │
// │    2    │ 7 │ 8 │ 9 │
// └─────────┴───┴───┴───┘

dataframe = createContainer(dataArray);
dataframe.print();
// ┌─────────┬───┬───┬───┐
// │ (index) │ 0 │ 1 │ 2 │
// ├─────────┼───┼───┼───┤
// │    0    │ 1 │ 2 │ 3 │
// │    1    │ 4 │ 5 │ 6 │
// │    2    │ 7 │ 8 │ 9 │
// └─────────┴───┴───┴───┘
```

### Example

```javascript
const data = [
  [5.1,3.5,1.4,0.2,"setosa"],
  [4.9,3.0,1.4,0.2,"setosa"],
  [4.7,3.2,1.3,0.2,"setosa"],
  [4.6,3.1,1.5,0.2,"setosa"],
  [5.0,3.6,1.4,0.2,"setosa"],
  [5.4,3.9,1.7,0.4,"setosa"],
  [4.6,3.4,1.4,0.3,"setosa"],
  [5.0,3.4,1.5,0.2,"setosa"],
  [4.4,2.9,1.4,0.2,"setosa"],
  [4.9,3.1,1.5,0.1,"setosa"]
];
const headers = [
  'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
];
const dataframe = createContainer(data);

dataframe.print();
// ┌─────────┬─────┬─────┬─────┬─────┬──────────┐
// │ (index) │  0  │  1  │  2  │  3  │    4     │
// ├─────────┼─────┼─────┼─────┼─────┼──────────┤
// │    0    │ 5.1 │ 3.5 │ 1.4 │ 0.2 │ 'setosa' │
// │    1    │ 4.9 │  3  │ 1.4 │ 0.2 │ 'setosa' │
// │    2    │ 4.7 │ 3.2 │ 1.3 │ 0.2 │ 'setosa' │
// │    3    │ 4.6 │ 3.1 │ 1.5 │ 0.2 │ 'setosa' │
// │    4    │  5  │ 3.6 │ 1.4 │ 0.2 │ 'setosa' │
// │    5    │ 5.4 │ 3.9 │ 1.7 │ 0.4 │ 'setosa' │
// │    6    │ 4.6 │ 3.4 │ 1.4 │ 0.3 │ 'setosa' │
// │    7    │  5  │ 3.4 │ 1.5 │ 0.2 │ 'setosa' │
// │    8    │ 4.4 │ 2.9 │ 1.4 │ 0.2 │ 'setosa' │
// │    9    │ 4.9 │ 3.1 │ 1.5 │ 0.1 │ 'setosa' │
// └─────────┴─────┴─────┴─────┴─────┴──────────┘

dataframe.headers = headers;
dataframe.print(0, 3);
// ┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
// │ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
// ├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
// │    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
// │    1    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
// │    2    │     4.7      │     3.2     │     1.3      │     0.2     │ 'setosa' │
// └─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘


dataframe.head();
// ┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
// │ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
// ├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
// │    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
// │    1    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
// │    2    │     4.7      │     3.2     │     1.3      │     0.2     │ 'setosa' │
// │    3    │     4.6      │     3.1     │     1.5      │     0.2     │ 'setosa' │
// │    4    │      5       │     3.6     │     1.4      │     0.2     │ 'setosa' │
// └─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘

dataframe.tail();
// ┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
// │ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
// ├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
// │    0    │     5.4      │     3.9     │     1.7      │     0.4     │ 'setosa' │
// │    1    │     4.6      │     3.4     │     1.4      │     0.3     │ 'setosa' │
// │    2    │      5       │     3.4     │     1.5      │     0.2     │ 'setosa' │
// │    3    │     4.4      │     2.9     │     1.4      │     0.2     │ 'setosa' │
// │    4    │     4.9      │     3.1     │     1.5      │     0.1     │ 'setosa' │
// └─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘

dataframe.describe();
// ┌──────────────┬───────┬──────┬──────────┬──────┬─────┬─────┐
// │   (index)    │ count │ mean │ variance │  sd  │ min │ max │
// ├──────────────┼───────┼──────┼──────────┼──────┼─────┼─────┤
// │ Sepal Length │  10   │ 4.86 │    0     │ 0.01 │ 4.4 │ 5.4 │
// │ Sepal Width  │  10   │ 3.31 │    0     │ 0.07 │ 2.9 │ 3.9 │
// │ Petal Length │  10   │ 1.45 │    0     │ 0.02 │ 1.3 │ 1.7 │
// │ Petal Width  │  10   │ 0.22 │    0     │ 0.04 │ 0.1 │ 0.4 │
// └──────────────┴───────┴──────┴──────────┴──────┴─────┴─────┘

dataframe.describe(5);
// ┌──────────────┬───────┬──────┬──────────┬─────────┬─────┬─────┐
// │   (index)    │ count │ mean │ variance │   sd    │ min │ max │
// ├──────────────┼───────┼──────┼──────────┼─────────┼─────┼─────┤
// │ Sepal Length │  10   │ 4.86 │ 0.00018  │ 0.01333 │ 4.4 │ 5.4 │
// │ Sepal Width  │  10   │ 3.31 │  0.0049  │  0.07   │ 2.9 │ 3.9 │
// │ Petal Length │  10   │ 1.45 │ 0.00028  │ 0.01667 │ 1.3 │ 1.7 │
// │ Petal Width  │  10   │ 0.22 │  0.0016  │  0.04   │ 0.1 │ 0.4 │
// └──────────────┴───────┴──────┴──────────┴─────────┴─────┴─────┘

dataframe
  .groupBy(['Petal Width'], [0.2])
  .print();
// ┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
// │ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
// ├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
// │    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
// │    1    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
// │    2    │     4.7      │     3.2     │     1.3      │     0.2     │ 'setosa' │
// │    3    │     4.6      │     3.1     │     1.5      │     0.2     │ 'setosa' │
// │    4    │      5       │     3.6     │     1.4      │     0.2     │ 'setosa' │
// │    5    │      5       │     3.4     │     1.5      │     0.2     │ 'setosa' │
// │    6    │     4.4      │     2.9     │     1.4      │     0.2     │ 'setosa' │
// └─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘

dataframe
  .groupBy(['Petal Length', 'Petal Width'], [1.4, 0.2])
  .print();
// ┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
// │ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
// ├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
// │    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
// │    1    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
// │    2    │      5       │     3.6     │     1.4      │     0.2     │ 'setosa' │
// │    3    │     4.4      │     2.9     │     1.4      │     0.2     │ 'setosa' │
// └─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘

dataframe
  .select(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'])
  .transpose()
// {
//   'Sepal Length': [5.1, 4.9, 4.7, 4.6, 5, 5.4, 4.6, 5, 4.4, 4.9],
//   'Sepal Width': [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1],
//   'Petal Length': [1.4, 1.4, 1.3, 1.5, 1.4, 1.7, 1.4, 1.5, 1.4, 1.5],
//   'Petal Width': [0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1]
// }


dataframe
  .select(['Sepal Length', 'Petal Length', 'Species'])
  .head();
// ┌─────────┬──────────────┬──────────────┬──────────┐
// │ (index) │ Sepal Length │ Petal Length │ Species  │
// ├─────────┼──────────────┼──────────────┼──────────┤
// │    0    │     5.1      │     1.4      │ 'setosa' │
// │    1    │     4.9      │     1.4      │ 'setosa' │
// │    2    │     4.7      │     1.3      │ 'setosa' │
// │    3    │     4.6      │     1.5      │ 'setosa' │
// │    4    │      5       │     1.4      │ 'setosa' │
// └─────────┴──────────────┴──────────────┴──────────┘
```

### API

#### `dataframe.describe([*dp*])`

Creates a summary of the statistics of numeric data in the dataframe, which is printed to the console as a table and returned as a object for further manipulation. The metrics reported are:
* Count
* Mean
* Variance
* Standard Deviation
* Minimum value
* Maximum value

##### Parameters

* `dp` (optional, default: `2`)—the number of decimal places to be rounded to internally using `Number.prototype.toFixed()`. The output observed in the console may be less than the number of decimal places specified since the string produced by `toFixed()` is converted back to a number using `Number()`

##### Return value

The object used to construct the table seen in the console.

#### `dataframe.groupBy(headers, features)`

Creates a new dataframe that contains only the data with the grouping conditions provided.

##### Parameters

* `headers`—an array of column indices or strings that that correspond to those found in `dataframe.headers`
* `features`—an array of the values of the features in each of the columns specified in headers to to be matched

##### Return value

A new dataframe containing rows that match the filters provided.

#### `dataframe.head([*rows*])`

Prints data starting from the first entry in `dataframe.data` to the console.

##### Parameters

* `rows` (optional, default: `5`)—the number of rows to be printed.

#### `dataset.print([*start* [*, end*]])`

Prints the specified number of row of the data in `dataframe.data` to the console. Calling the function without providing

##### Parameters

* `start` (optional, default: `0`)—zero-based index of the entry in `dataframe.data` to begin printing with.
* `end` (optional)—zero-based index of the entry in `dataframe.data` to terminate printing with.

#### `dataframe.readData(input)`

Processes a CSV string or clones an array of arrays and assigns the result to `dataframe.data`.

##### Parameters

* `input`—a CSV file that is read into memory as a string or an array of arrays, where each subarray corresponds to a row in the CSV data.

#### `dataframe.transpose()`

Creates an array of features for each of the columns in `dataframe.data`.

##### Return value

An object of which each property corresponds to a header in `dataframe.headers` and its values is an array of the corresponding values in `dataframe.data`.

#### `dataframe.tail(rows)`

Prints the last few rows of, and always ending with the last row in, `dataframe.data` to the console.

##### Parameters

* `rows` (optional, default: `5`)—the number of rows to be printed.





----
