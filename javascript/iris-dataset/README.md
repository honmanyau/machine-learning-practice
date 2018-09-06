# KNN Classification of Fisher's Iris Dataset

## Table of Contents

* [Introduction](#introduction)
* [Dataset](#dataset)
* [Data Preparation](#data-preparation)
  * [Manual Cleaning](#manual-cleaning)
  * [Automated Cleaning](#automated-cleaning)
  * [Converting to CSV Format](#converting-to-csv-format)
* [Data Integrity](#data-integrity)
* [Data Analysis](#data-analysis)
  * [Statistics Parameters of the Entire Dataset](#statistics-parameters-of-the-entire-dataset)
  * [Statistics Parameters by Iris Species](#statistics-parameters-by-iris-species)
  * [Visualisation of the Entire Dataset](#visualisation-of-the-entire-dataset)
  * [KNN](#knn)
  * [Neural Network](#neural-network)
* [Documentation for dataframe.ts](#documentation-for-dataframets)
* [Scatter Chart React Component](#scatter-chart-react-component)


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

The raw data can be found in [/data/raw](https://github.com/honmanyau/machine-learning-practice/tree/master/javascript/knn-fisher-iris-dataset/data/raw)

### Automated Cleaning

Since some of the the decimal points were not correctly copied initially, the cleaning was automated as follows:

1. Find non-empty lines that are not headers in each of the raw data files
2. Ensure that the second character, which is always a decimal point, is the `.` character

The cleaned raw data can be found in [/data/raw-cleaned](https://github.com/honmanyau/machine-learning-practice/tree/master/javascript/knn-fisher-iris-dataset/data/raw-cleaned) and the corresponding code can be found in [/data/clean-raw.ts](https://github.com/honmanyau/machine-learning-practice/blob/master/javascript/knn-fisher-iris-dataset/data/clean-raw.ts).

### Converting to CSV Format

While the CSV format is strictly not required in this case (and that CSV files for this dataset is already widely available), it is usually good practice to make data available to others in a widely used and workable format.

The format to be converted to is as follows:

```
'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
```

The CSV files can be found in [/data/csv](https://github.com/honmanyau/machine-learning-practice/tree/master/javascript/knn-fisher-iris-dataset/data/csv) and the corresponding code can be found in [/data/convert-raw-to-csv.ts](https://github.com/honmanyau/machine-learning-practice/blob/master/javascript/knn-fisher-iris-dataset/data/convert-raw-to-csv.ts).

### Converting CSV Data to Array

Given a CSV file that is loaded into memory as a string, the conversion of that string into an array of arrays that can be used for further manipulation using JavaScript can be achieved simply using the following code:

```javascript
csvString.split(/\r*\n/).map((line) => line.split(','));
```

A utility that produces a data dataframe with methods for visualising (in the console) and performing basic analyses and manipulation was written and can be found in [utils/dataframe.ts](https://github.com/honmanyau/machine-learning-practice/blob/master/javascript/knn-fisher-iris-dataset/utils/dataframe.ts).

## Data Integrity

Data integrity was inspected by comparing statistics parameters generated against those generated using [this Jupyter notebook](https://github.com/MicrosoftLearning/Principles-of-Machine-Learning-Python).

A significant difference of the calculated parameters for sepal length was observed, which was found to be caused by an incorrectly transcribed value (`6.4` instead of `5.4` on line 32 of the combined csv data). The reference parameters and final calculated parameters of the corrected data are shown below.

[Reference](https://github.com/MicrosoftLearning/Principles-of-Machine-Learning-Python):
```
┌──────────────┬───────┬────────┬────────┬─────────┬─────────┐
│   (index)    │ count │  mean  │   sd   │   min   │   max   │
├──────────────┼───────┼────────┼────────┼─────────┼─────────┤
│ Sepal Length │  150  │ 5.8433 │ 0.8281 │ 4.3000  │ 7.9000  │
│ Sepal Width  │  150  │ 3.0573 │ 0.4359 │ 2.0000  │ 4.4000  │
│ Petal Length │  150  │ 3.758  │ 1.7653 │ 1.0000  │ 6.9000  │
│ Petal Width  │  150  │ 1.1993 │ 0.7622 │ 0.1000  │ 2.5000  │
└──────────────┴───────┴────────┴────────┴─────────┴─────────┘
```

Calculated:
```
┌──────────────┬───────┬────────┬────────┬─────┬─────┐
│   (index)    │ count │  mean  │   sd   │ min │ max │
├──────────────┼───────┼────────┼────────┼─────┼─────┤
│ Sepal Length │  150  │ 5.8433 │ 0.8281 │ 4.3 │ 7.9 │
│ Sepal Width  │  150  │ 3.0573 │ 0.4359 │  2  │ 4.4 │
│ Petal Length │  150  │ 3.758  │ 1.7653 │  1  │ 6.9 │
│ Petal Width  │  150  │ 1.1993 │ 0.7622 │ 0.1 │ 2.5 │
└──────────────┴───────┴────────┴────────┴─────┴─────┘
```

## Data Analysis

The `iris` identifier below is a dataframe created using the `createDataframe` utility, with `iris.headers = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species']`.

### Statistics Parameters of the Entire Dataset

```javascript
iris.describe();
/*
┌──────────────┬───────┬────────┬──────────┬────────┬─────┬─────┐
│   (index)    │ count │  mean  │ variance │   sd   │ min │ max │
├──────────────┼───────┼────────┼──────────┼────────┼─────┼─────┤
│ Sepal Length │  150  │ 5.8433 │  0.6857  │ 0.8281 │ 4.3 │ 7.9 │
│ Sepal Width  │  150  │ 3.0573 │   0.19   │ 0.4359 │  2  │ 4.4 │
│ Petal Length │  150  │ 3.758  │  3.1163  │ 1.7653 │  1  │ 6.9 │
│ Petal Width  │  150  │ 1.1993 │  0.581   │ 0.7622 │ 0.1 │ 2.5 │
└──────────────┴───────┴────────┴──────────┴────────┴─────┴─────┘
*/
```

### Statistics Parameters by Iris Species

```javascript
const setosa = iris.filter({ Species: 'setosa' });
const virginica = iris.filter({ Species: 'virginica' });
const versicolor = iris.filter({ Species: 'versicolor' });

setosa.describe();
/*
┌──────────────┬───────┬───────┬──────────┬────────┬─────┬─────┐
│   (index)    │ count │ mean  │ variance │   sd   │ min │ max │
├──────────────┼───────┼───────┼──────────┼────────┼─────┼─────┤
│ Sepal Length │  50   │ 5.006 │  0.1242  │ 0.3525 │ 4.3 │ 5.8 │
│ Sepal Width  │  50   │ 3.428 │  0.1437  │ 0.3791 │ 2.3 │ 4.4 │
│ Petal Length │  50   │ 1.462 │  0.0302  │ 0.1737 │  1  │ 1.9 │
│ Petal Width  │  50   │ 0.246 │  0.0111  │ 0.1054 │ 0.1 │ 0.6 │
└──────────────┴───────┴───────┴──────────┴────────┴─────┴─────┘
*/

virginica.describe();
/*
┌──────────────┬───────┬───────┬──────────┬────────┬─────┬─────┐
│   (index)    │ count │ mean  │ variance │   sd   │ min │ max │
├──────────────┼───────┼───────┼──────────┼────────┼─────┼─────┤
│ Sepal Length │  50   │ 6.588 │  0.4043  │ 0.6359 │ 4.9 │ 7.9 │
│ Sepal Width  │  50   │ 2.974 │  0.104   │ 0.3225 │ 2.2 │ 3.8 │
│ Petal Length │  50   │ 5.552 │  0.3046  │ 0.5519 │ 4.5 │ 6.9 │
│ Petal Width  │  50   │ 2.026 │  0.0754  │ 0.2747 │ 1.4 │ 2.5 │
└──────────────┴───────┴───────┴──────────┴────────┴─────┴─────┘
*/

versicolor.describe();
/*
┌──────────────┬───────┬───────┬──────────┬────────┬─────┬─────┐
│   (index)    │ count │ mean  │ variance │   sd   │ min │ max │
├──────────────┼───────┼───────┼──────────┼────────┼─────┼─────┤
│ Sepal Length │  50   │ 5.936 │  0.2664  │ 0.5162 │ 4.9 │  7  │
│ Sepal Width  │  50   │ 2.77  │  0.0985  │ 0.3138 │  2  │ 3.4 │
│ Petal Length │  50   │ 4.26  │  0.2208  │ 0.4699 │  3  │ 5.1 │
│ Petal Width  │  50   │ 1.326 │  0.0391  │ 0.1978 │  1  │ 1.8 │
└──────────────┴───────┴───────┴──────────┴────────┴─────┴─────┘
*/
```

### Visualisation of the Entire Dataset

All six possible feature combinations are visualised with scatter plots. *Iris setosa* appears to be distinctly different to *Iris virginica* and *Iris versicolor* in all cases. The data points between *Iris virginica* and *Iris versicolor* overlap to some degree in all cases, but the separation between the two are still statistically significant in all cases except for sepal length vs. sepal width.

#### Sepal Length vs. Sepal Width of All Species

![Sepal Length vs. Sepal Width of All Species](./images/sepal-length-vs-sepal-width-all.svg)

#### Sepal Length vs. Petal Length of All Species

![Sepal Length vs. Petal Length of All Species](./images/sepal-length-vs-petal-length-all.svg)

#### Sepal Length vs. Petal Width of All Species

![Sepal Length vs. Petal Length of All Species](./images/sepal-length-vs-petal-length-all.svg)

#### Sepal Width vs. Petal Length of All Species

![Sepal Length vs. Petal Length of All Species](./images/sepal-width-vs-petal-length-all.svg)

#### Sepal Width vs. Petal Width of All Species

![Sepal Length vs. Petal Length of All Species](./images/sepal-width-vs-petal-width-all.svg)

#### Petal Length vs. Petal Width of All Species

![Sepal Length vs. Petal Length of All Species](./images/petal-length-vs-petal-width-all.svg)

### KNN

#### Converting Non-numeric Features

The non-numeric features `Species` was converted using `dataset.replace()`:

|  Species   | Integer |
| ---------- | ------- |
| Setosa     | 0       |
| Virginica  | 1       |
| Versicolor | 2       |

#### Data Shuffling

Data was shuffled using `dataframe.shuffle()` (pseudo-random as `Math.random()` is used, which is an implementation of the Durstenfeld shuffle algorithm.

### Feature Scaling

Each of the features were scaled through [feature standardisation](https://en.wikipedia.org/wiki/Feature_scaling#Standardization) to have (as close as possible) zero-mean and unit variance using `dataframe.standardise()`.

### Dataset Splitting

After shuffling and scaling, the dataset was split into two halves (75 data points each), one being the training set and the other the validation set.

It is worth noting that since the dataset is shuffled every time the code is run and that the dataset is of limited size, one would expect variation in prediction accuracy each time the code is compiled, which was indeed observed (discussion below).

### Machine Learning with the KNN Algorithm

The [KNN algorithm](https://github.com/mljs/knn) in the ml.js machine learning suite was used. A custom  definition file was added to `node_modules/@type` to crudely make the library compatible with TypeScript:

```
declare module 'ml-knn' {
  export default class KNN {
      constructor(
        dataset: number[][],
        labels: any[],
        options?: {
          k?: number,
          distance?: (u: number[], v: number[]) => number
        }
      );

      public predict(dataset: any[]): number[];
  }
}
```

Starting with a `k` value of `1`, and a 50%-50% training-validation split (random sample of all species), the accuracy (number of true positives divided by the size of the validations set) was initially observed to vary in the range of 89–97%.

Running the code for 10000 iterations (4–5 ms per iteration in Firefox Developer Edition with a 2.8 GHz Intel® Core™ i7-4558U) at `k` equals to `1` resulted in the following unique (before rounding) accuracies: **100%, 99%, 97%, 96%, 95%, 93%, 92%, 91%, 89%, 88%, 87%, 85%, 84%, 83** (it just happens to be the case that the same accuracy is not observed after rounding). A summary of the statics for 10000 iterations are as follows:

```
┌──────────────┬───────┬────────┬──────────┬────────┬────────┬─────┐
│   (index)    │ count │  mean  │ variance │   sd   │  min   │ max │
├──────────────┼───────┼────────┼──────────┼────────┼────────┼─────┤
│ Iterations   │ 10000 │ 0.9361 │  0.0005  │ 0.0227 │ 0.8267 │  1  │
└──────────────┴───────┴────────┴──────────┴────────┴────────┴─────┘
```

The results for different values of `k` is as summarised in **Table 1**:

**Table 1**. Statistic parameters for `k` between `1` and `20` (inclusive) using a 50%-50% training-validation split (75 entries per set with random contribution from the iris species. Each row is the result of 10000 iterations.

| k  | count |  mean  | variance |   sd   |  min  | max |
| -- | ----- | ------ | -------- | ------ | ----- | --- |
| 1  | 10000 | 93.61  |  5.18    |  2.28  | 82.67 | 100 |
| 2  | 10000 | 92.07  |  7.38    |  2.72  | 81.33 | 100 |
| 3  | 10000 | 94.20  |  5.39    |  2.32  | 81.33 | 100 |
| 4  | 10000 | 93.74  |  6.77    |  2.60  | 80.00 | 100 |
| 5  | 10000 | 94.60  |  5.70    |  2.39  | 82.67 | 100 |
| 6  | 10000 | 94.14  |  6.64    |  2.58  | 77.33 | 100 |
| 7  | 10000 | 94.75  |  6.08    |  2.47  | 80.00 | 100 |
| 8  | 10000 | 94.07  |  8.00    |  2.83  | 76.00 | 100 |
| 9  | 10000 | 94.53  |  7.12    |  2.67  | 77.33 | 100 |
| 10 | 10000 | 93.91  |  8.97    |  2.99  | 68.00 | 100 |
| 11 | 10000 | 93.96  |  8.98    |  3.00  | 80.00 | 100 |
| 12 | 10000 | 92.86  |  12.05   |  3.47  | 77.33 | 100 |
| 13 | 10000 | 93.33  |  11.26   |  3.36  | 78.67 | 100 |
| 14 | 10000 | 92.39  |  13.92   |  3.73  | 74.67 | 100 |
| 15 | 10000 | 92.61  |  13.67   |  3.70  | 76.00 | 100 |
| 16 | 10000 | 91.16  |  16.60   |  4.07  | 73.33 | 100 |
| 17 | 10000 | 91.64  |  15.77   |  3.97  | 69.33 | 100 |
| 18 | 10000 | 90.28  |  16.54   |  4.07  | 66.67 | 100 |
| 19 | 10000 | 90.64  |  16.01   |  4.00  | 60.00 | 100 |
| 20 | 10000 | 89.50  |  15.94   |  3.99  | 64.00 | 100 |

The accuracy of the classifier starts to decrease as `k` increases to around `9`, which is consistent with the fact that the signal-to-noise ratio reduces as `k` increases. In those cases, most models produced have reasonable accuracies of > 90%. Balancing the contribution of data from each species leads to consistently more accurate (albeit small) models as can be seen in **Table 2**.

**Table 2**.Statistic parameters for `k` between `1` and `20` (inclusive) using a 50%-50% training-validation split. There are 75 entries in both set with equal contribution from each iris species. Each row is the result of 10000 iterations.

| k  | count |  mean  | variance |   sd   |  min  | max |
| -- | ----- | ------ | -------- | ------ | ----- | --- |
| 1  | 10000 | 93.71  |   4.77   |  2.18  | 84.00 | 100 |
| 2  | 10000 | 92.32  |   6.80   |  2.61  | 82.67 | 100 |
| 3  | 10000 | 94.42  |   4.88   |  2.21  | 84.00 | 100 |
| 4  | 10000 | 93.96  |   5.96   |  2.44  | 82.67 | 100 |
| 5  | 10000 | 94.88  |   4.86   |  2.20  | 80.00 | 100 |
| 6  | 10000 | 94.54  |   5.38   |  2.32  | 84.00 | 100 |
| 7  | 10000 | 95.08  |   5.07   |  2.25  | 81.33 | 100 |
| 8  | 10000 | 94.49  |   6.29   |  2.51  | 81.33 | 100 |
| 9  | 10000 | 95.01  |   5.34   |  2.31  | 84.00 | 100 |
| 10 | 10000 | 94.33  |   6.75   |  2.60  | 78.67 | 100 |
| 11 | 10000 | 94.56  |   6.46   |  2.54  | 80.00 | 100 |
| 12 | 10000 | 93.68  |   8.68   |  2.95  | 80.00 | 100 |
| 13 | 10000 | 94.01  |   8.43   |  2.90  | 80.00 | 100 |
| 14 | 10000 | 93.20  |   10.79  |  3.28  | 77.33 | 100 |
| 15 | 10000 | 93.34  |   10.49  |  3.24  | 78.67 | 100 |
| 16 | 10000 | 91.96  |   13.50  |  3.67  | 74.67 | 100 |
| 17 | 10000 | 92.44  |   12.84  |  3.58  | 76.00 | 100 |
| 18 | 10000 | 91.07  |   13.79  |  3.71  | 77.33 | 100 |
| 19 | 10000 | 91.32  |   13.95  |  3.73  | 76.00 | 100 |
| 20 | 10000 | 89.85  |   13.61  |  3.69  | 78.67 | 100 |

Methods such as cross validation is not discussed as it is not the focus of this learning exercise, but may be added later.

### Neural Network

#### Optimiser Selection

The [Tensorflow.js](https://js.tensorflow.org) library was used for constructing neural networks and is based the official [Getting Started](https://js.tensorflow.org/tutorials/mnist.html) article.

The following layers were used to begin with:

* **Input layer**
  * `inputShape`: `[4]`
  * `units`: `4`
  * `activation`: `'sigmoid'`
* **Hidden layer**
  * `units`: `2`
  * `activation`: `'sigmoid'`
* **Output layer**
  * `units`: `3`
  * `activation`: `'softmax'`

With the exception of the number of output size (`units`) of the output layer, all other unit sizes were arbitrarily chosen (well, [with a bit of guidance](https://stats.stackexchange.com/questions/181/how-to-choose-the-number-of-hidden-layers-and-nodes-in-a-feedforward-neural-netw)). The [softmax](https://developers.google.com/machine-learning/glossary/#softmax) activation function is used for the output layer as it is a 3-class classification problem and a sum to unit probability is desired.

As a comparison to the KNN results above, 50%-50% split was first used. Using a mean squared error loss function, 100 epochs, and a stochastic gradient descent (SGD) optimiser with a learning rate of `0.1`. Training loss remained high and appears to reach and asymptote at approximately 0.22 after at the end of 100 epochs (**Figure 1**, royal blue curve). Increasing the learning rate to 1 appears to move the model in the right direction but validation loss remained high at approximately 0.12 after 100 epochs. Similar results to those obtained with an SGD optimiser were obtained using an [ADADELTA](https://arxiv.org/abs/1212.5701) optimiser.

Both the [Adam](https://arxiv.org/abs/1412.6980) and [AdaMax](https://arxiv.org/abs/1412.6980) (a variant of Adam) perform substantially better with the same **initial** setup described above, reducing the training loss to < 0.02 (**Figure 1**, orange curve). The Adam optimiser appears to perform slightly at leats with the initial parameters and was used for subsequent training.

![Validation Loss vs. Epoch for Different Optimisers](./images/validation-loss-vs-epochs-optimisers.svg)

**Figure 1**. A representative scatter plot of validation loss vs. epoch using an SGD optimiser (royal blue) and an Adam optimiser (orange), both at a learning rate of 0.1. The training set size is 75, with equal contribution from each of the three iris species, *Iris setosa*, *Iris virginica* and *Iris versicolor*.

#### Learning Rate, Epochs, and Accuracy

Increasing the number of epochs to 200 while maintaining a learning rate of 0.1 leads to oscillation of training loss with an amplitude of approximately 0.01. Reduction of the learning rate to 0.05 and then further to 0.02 reduces the amplitude of the oscillation to < 0.005.

A representative model was trained incrementally for 500 epochs; the corresponding training accuracy, training loss are summarised in **Figure 2**, and the validation accuracy and validation loss in **Figure 3**.

![Training Accuracy and Loss for an Adam Optimiser](./images/training-accuracy-loss-adam.svg)

**Figure 2**. A representative scatter plot of **training** accuracy (royal blue) and loss (dark turquoise) vs. epoch using an Adam optimiser at a learning rate of 0.02. The training set has a size of 75, with equal contribution from each of the three iris species, *Iris setosa*, *Iris virginica* and *Iris versicolor*.

![Validation Accuracy and Loss for an Adam Optimiser](./images/validation-accuracy-loss-adam.svg)

**Figure 3**. A representative scatter plot of **validation** accuracy (crimson) and loss (pink) vs. epoch using an Adam optimiser at a learning rate of 0.02. Both the training and validation sets have a size of 75, with equal contribution from each of the three iris species, *Iris setosa*, *Iris virginica* and *Iris versicolor*.

A model typically reaches stable training and validation accuracies after approximately 50 epochs, while both training and validation loss continue to slowly decrease, there are no appreciable signs of overfitting with the parameters used over 500 iterations. It is important to note that, in our case, a predicted set of softmax probabilities is considered a true positive if the species with the highest probability matches the corresponding entry in the validation labels; for this reason, a predicted set of probabilities of `[ 0.08 0.42 0.50 ]` is considered a match for `[ 0, 0, 1 ]`.

The particular example given above is deliberately "problematic" to illustrate that a high accuracy doesn't necessarily mean high confidence—which is the difference between between when validation and training accuracies have just plateaued at around 50 epochs and, say, 100 epochs later. Using a running our example, the probabilities `[ 0.08 0.42 0.50 ]` could become, for example, `[ 0.02 0.07 0.91 ]` if one continues to train the model. This reinforces the fact that training loss and validation loss are much better metrics at indicating whether or not a model is adequately trained ([related reading](https://stackoverflow.com/questions/34518656/how-to-interpret-loss-and-accuracy-for-a-machine-learning-model#34519264)).

## Documentation for dataframe.ts

The dataframe utility is a crude reinvention of some of the functionalities commonly found in other data processing packages. **There are currently little to no error-checking facilities in these methods, and no library is used to mitigate floating point errors.**

### Usage

The dataframe utility provides a function, `createDataframe`, for creating a dataframe object:

```javascript
import { createDataframe } from './utils/dataframe';

const csv = '1,2,3\n4,5,6\n7,8,9\n';
const dataArray = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

let dataframe;

dataframe = createDataframe(csv);
dataframe.print();

// ┌─────────┬───┬───┬───┐
// │ (index) │ 0 │ 1 │ 2 │
// ├─────────┼───┼───┼───┤
// │    0    │ 1 │ 2 │ 3 │
// │    1    │ 4 │ 5 │ 6 │
// │    2    │ 7 │ 8 │ 9 │
// └─────────┴───┴───┴───┘

dataframe = createDataframe(dataArray);
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
  [ 5.1, 3.5, 1.4, 0.2, 'setosa' ],
  [ 4.9, 3.0, 1.4, 0.2, 'setosa' ],
  [ 4.7, 3.2, 1.3, 0.2, 'setosa' ],
  [ 4.6, 3.1, 1.5, 0.2, 'setosa' ],
  [ 5.0, 3.6, 1.4, 0.2, 'setosa' ],
  [ 5.4, 3.9, 1.7, 0.4, 'setosa' ],
  [ 4.6, 3.4, 1.4, 0.3, 'setosa' ],
  [ 5.0, 3.4, 1.5, 0.2, 'setosa' ],
  [ 4.4, 2.9, 1.4, 0.2, 'setosa' ],
  [ 4.9, 3.1, 1.5, 0.1, 'setosa' ]
];
const headers = [
  'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
];
// Create dataframe
const dataframe = createDataframe(data);

// Inspect the first three entries in dataframe.data
dataframe.print(0, 3);
/*
┌─────────┬─────┬─────┬─────┬─────┬──────────┐
│ (index) │  0  │  1  │  2  │  3  │    4     │
├─────────┼─────┼─────┼─────┼─────┼──────────┤
│    0    │ 5.1 │ 3.5 │ 1.4 │ 0.2 │ 'setosa' │
│    1    │ 4.9 │  3  │ 1.4 │ 0.2 │ 'setosa' │
│    2    │ 4.7 │ 3.2 │ 1.3 │ 0.2 │ 'setosa' │
└─────────┴─────┴─────┴─────┴─────┴──────────┘
*/

// Set headers
dataframe.headers = headers;
dataframe.print();
/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
│    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
│    1    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
│    2    │     4.7      │     3.2     │     1.3      │     0.2     │ 'setosa' │
│    3    │     4.6      │     3.1     │     1.5      │     0.2     │ 'setosa' │
│    4    │      5       │     3.6     │     1.4      │     0.2     │ 'setosa' │
│    5    │     5.4      │     3.9     │     1.7      │     0.4     │ 'setosa' │
│    6    │     4.6      │     3.4     │     1.4      │     0.3     │ 'setosa' │
│    7    │      5       │     3.4     │     1.5      │     0.2     │ 'setosa' │
│    8    │     4.4      │     2.9     │     1.4      │     0.2     │ 'setosa' │
│    9    │     4.9      │     3.1     │     1.5      │     0.1     │ 'setosa' │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘
*/

// Other methods for inspecting the data
dataframe.head();
/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
│    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
│    1    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
│    2    │     4.7      │     3.2     │     1.3      │     0.2     │ 'setosa' │
│    3    │     4.6      │     3.1     │     1.5      │     0.2     │ 'setosa' │
│    4    │      5       │     3.6     │     1.4      │     0.2     │ 'setosa' │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘
*/

dataframe.head(1);
/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
│    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘
*/

dataframe.tail();
/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
│    0    │     5.4      │     3.9     │     1.7      │     0.4     │ 'setosa' │
│    1    │     4.6      │     3.4     │     1.4      │     0.3     │ 'setosa' │
│    2    │      5       │     3.4     │     1.5      │     0.2     │ 'setosa' │
│    3    │     4.4      │     2.9     │     1.4      │     0.2     │ 'setosa' │
│    4    │     4.9      │     3.1     │     1.5      │     0.1     │ 'setosa' │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘
*/

// Statistic parameters of the data
dataframe.describe();
/*
┌──────────────┬───────┬──────┬──────────┬────────┬─────┬─────┐
│   (index)    │ count │ mean │ variance │   sd   │ min │ max │
├──────────────┼───────┼──────┼──────────┼────────┼─────┼─────┤
│ Sepal Length │  10   │ 4.86 │  0.0849  │ 0.2914 │ 4.4 │ 5.4 │
│ Sepal Width  │  10   │ 3.31 │  0.0943  │ 0.3071 │ 2.9 │ 3.9 │
│ Petal Length │  10   │ 1.45 │  0.0117  │ 0.108  │ 1.3 │ 1.7 │
│ Petal Width  │  10   │ 0.22 │  0.0062  │ 0.0789 │ 0.1 │ 0.4 │
└──────────────┴───────┴──────┴──────────┴────────┴─────┴─────┘
*/

// Filter by the column header "Petal Width"
dataframe
  .filter({ 'Petal Width': 0.2 })
  .print();

/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
│    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
│    1    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
│    2    │     4.7      │     3.2     │     1.3      │     0.2     │ 'setosa' │
│    3    │     4.6      │     3.1     │     1.5      │     0.2     │ 'setosa' │
│    4    │      5       │     3.6     │     1.4      │     0.2     │ 'setosa' │
│    5    │      5       │     3.4     │     1.5      │     0.2     │ 'setosa' │
│    6    │     4.4      │     2.9     │     1.4      │     0.2     │ 'setosa' │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘
*/

// Multipler filters
dataframe
  .filter({ 'Petal Length': 1.4, 'Petal Width': 0.2 })
  .print();
/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
│    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
│    1    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
│    2    │      5       │     3.6     │     1.4      │     0.2     │ 'setosa' │
│    3    │     4.4      │     2.9     │     1.4      │     0.2     │ 'setosa' │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘
*/

// Cloning a dataframe
const firstClone = dataframe.clone();

// Shuffle entries in dataframe.data
dataframe.shuffle();

dataframe.print();
/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
│    0    │     4.4      │     2.9     │     1.4      │     0.2     │ 'setosa' │
│    1    │     4.6      │     3.4     │     1.4      │     0.3     │ 'setosa' │
│    2    │      5       │     3.4     │     1.5      │     0.2     │ 'setosa' │
│    3    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
│    4    │     5.4      │     3.9     │     1.7      │     0.4     │ 'setosa' │
│    5    │     4.7      │     3.2     │     1.3      │     0.2     │ 'setosa' │
│    6    │     4.9      │     3.1     │     1.5      │     0.1     │ 'setosa' │
│    7    │      5       │     3.6     │     1.4      │     0.2     │ 'setosa' │
│    8    │     4.6      │     3.1     │     1.5      │     0.2     │ 'setosa' │
│    9    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘
*/
firstClone.print();
/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬──────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species  │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼──────────┤
│    0    │     5.1      │     3.5     │     1.4      │     0.2     │ 'setosa' │
│    1    │     4.9      │      3      │     1.4      │     0.2     │ 'setosa' │
│    2    │     4.7      │     3.2     │     1.3      │     0.2     │ 'setosa' │
│    3    │     4.6      │     3.1     │     1.5      │     0.2     │ 'setosa' │
│    4    │      5       │     3.6     │     1.4      │     0.2     │ 'setosa' │
│    5    │     5.4      │     3.9     │     1.7      │     0.4     │ 'setosa' │
│    6    │     4.6      │     3.4     │     1.4      │     0.3     │ 'setosa' │
│    7    │      5       │     3.4     │     1.5      │     0.2     │ 'setosa' │
│    8    │     4.4      │     2.9     │     1.4      │     0.2     │ 'setosa' │
│    9    │     4.9      │     3.1     │     1.5      │     0.1     │ 'setosa' │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┴──────────┘
*/

// Features standardisation
dataframe.standardise();
dataframe.describe();
/*
┌──────────────┬───────┬──────┬──────────┬────┬─────────┬────────┐
│   (index)    │ count │ mean │ variance │ sd │   min   │  max   │
├──────────────┼───────┼──────┼──────────┼────┼─────────┼────────┤
│ Sepal Length │  10   │  0   │    1     │ 1  │ -1.5788 │ 1.8534 │
│ Sepal Width  │  10   │  -0  │    1     │ 1  │ -1.3349 │ 1.921  │
│ Petal Length │  10   │  -0  │    1     │ 1  │ -1.3887 │ 2.3146 │
│ Petal Width  │  10   │  0   │    1     │ 1  │ -1.5213 │ 2.2819 │
└──────────────┴───────┴──────┴──────────┴────┴─────────┴────────┘
*/

// Revert changes made to data by the standardised method
dataframe.destandardise();
dataframe.describe();
/*
┌──────────────┬───────┬──────┬──────────┬────────┬─────┬─────┐
│   (index)    │ count │ mean │ variance │   sd   │ min │ max │
├──────────────┼───────┼──────┼──────────┼────────┼─────┼─────┤
│ Sepal Length │  10   │ 4.86 │  0.0849  │ 0.2914 │ 4.4 │ 5.4 │
│ Sepal Width  │  10   │ 3.31 │  0.0943  │ 0.3071 │ 2.9 │ 3.9 │
│ Petal Length │  10   │ 1.45 │  0.0117  │ 0.108  │ 1.3 │ 1.7 │
│ Petal Width  │  10   │ 0.22 │  0.0062  │ 0.0789 │ 0.1 │ 0.4 │
└──────────────┴───────┴──────┴──────────┴────────┴─────┴─────┘
*/

// Standardisation meta gets carried over to clones, filtrates and selections
dataframe.standardise();

const secondClone = dataframe.clone();

dataframe.destandardise();
secondClone.describe();
/*
┌──────────────┬───────┬──────┬──────────┬────┬─────────┬────────┐
│   (index)    │ count │ mean │ variance │ sd │   min   │  max   │
├──────────────┼───────┼──────┼──────────┼────┼─────────┼────────┤
│ Sepal Length │  10   │  0   │    1     │ 1  │ -1.5788 │ 1.8534 │
│ Sepal Width  │  10   │  -0  │    1     │ 1  │ -1.3349 │ 1.921  │
│ Petal Length │  10   │  0   │    1     │ 1  │ -1.3887 │ 2.3146 │
│ Petal Width  │  10   │  0   │    1     │ 1  │ -1.5213 │ 2.2819 │
└──────────────┴───────┴──────┴──────────┴────┴─────────┴────────┘
*/
secondClone.destandardise();
secondClone.describe();
/*
┌──────────────┬───────┬──────┬──────────┬────────┬─────┬─────┐
│   (index)    │ count │ mean │ variance │   sd   │ min │ max │
├──────────────┼───────┼──────┼──────────┼────────┼─────┼─────┤
│ Sepal Length │  10   │ 4.86 │  0.0849  │ 0.2914 │ 4.4 │ 5.4 │
│ Sepal Width  │  10   │ 3.31 │  0.0943  │ 0.3071 │ 2.9 │ 3.9 │
│ Petal Length │  10   │ 1.45 │  0.0117  │ 0.108  │ 1.3 │ 1.7 │
│ Petal Width  │  10   │ 0.22 │  0.0062  │ 0.0789 │ 0.1 │ 0.4 │
└──────────────┴───────┴──────┴──────────┴────────┴─────┴─────┘
*/

// Select columns
dataframe
  .select(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'])
  .head();
/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┤
│    0    │     4.6      │     3.1     │     1.5      │     0.2     │
│    1    │     4.4      │     2.9     │     1.4      │     0.2     │
│    2    │      5       │     3.6     │     1.4      │     0.2     │
│    3    │     4.6      │     3.4     │     1.4      │     0.3     │
│    4    │     5.1      │     3.5     │     1.4      │     0.2     │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┘
*/

// Collecting features into arrays
dataframe.transpose();
/*
{
  'Sepal Length': [5.1, 4.9, 4.7, 4.6, 5, 5.4, 4.6, 5, 4.4, 4.9],
  'Sepal Width': [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1],
  'Petal Length': [1.4, 1.4, 1.3, 1.5, 1.4, 1.7, 1.4, 1.5, 1.4, 1.5],
  'Petal Width': [0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1]
}
*/

// Replacing strings
const thirdClone = dataframe.clone();

thirdClone.replace( 'Species', { setosa: 0 });
thirdClone.head();
/*
┌─────────┬──────────────┬─────────────┬──────────────┬─────────────┬─────────┐
│ (index) │ Sepal Length │ Sepal Width │ Petal Length │ Petal Width │ Species │
├─────────┼──────────────┼─────────────┼──────────────┼─────────────┼─────────┤
│    0    │      5       │     3.6     │     1.4      │     0.2     │    0    │
│    1    │     4.6      │     3.1     │     1.5      │     0.2     │    0    │
│    2    │     4.4      │     2.9     │     1.4      │     0.2     │    0    │
│    3    │     4.9      │      3      │     1.4      │     0.2     │    0    │
│    4    │     4.7      │     3.2     │     1.3      │     0.2     │    0    │
└─────────┴──────────────┴─────────────┴──────────────┴─────────────┴─────────┘
*/
```

### `dataframe.clone()`

Creates a copy of a dataframe where `dataframe.headers` and `dataframe.data` are deep clones of the original.

#### Return value

A new dataframe containing deep-cloned headers and data of the original.

### `dataframe.describe([*dp*])`

Creates a summary of the statistics of numeric data in the dataframe, which is printed to the console as a table and returned as a object for further manipulation. The metrics reported are:
* Count
* Mean
* Variance
* Standard Deviation
* Minimum value
* Maximum value

#### Parameters

* `dp` (optional, default: `4`)—the number of decimal places to be rounded to internally using `Number.prototype.toFixed()`. The output observed in the console may be less than the number of decimal places specified since the string produced by `toFixed()` is converted back to a number using `Number()`. No rounding will occur when the argument is `false`.

#### Return value

The object used to construct the table seen in the console.

### `dataframe.destandardise()`

Reverts changes to the data made by `dataframe.standardise()`.

### `dataframe.filter(conditions)`

Creates a new dataframe that contains only the data with the grouping conditions provided.

#### Parameters

* `conditions`—an object whose keys are headers of the columns to be filtered and values are the values to filter with.

#### Return value

A new dataframe containing rows that match the filters provided.

### `dataframe.head([*rows*])`

Prints data starting from the first entry in `dataframe.data` to the console.

#### Parameters

* `rows` (optional, default: `5`)—the number of rows to be printed.

### `dataframe.print([*start* [*, end*]])`

Prints the specified number of row of the data in `dataframe.data` to the console. Calling the function without providing

#### Parameters

* `start` (optional, default: `0`)—zero-based index of the entry in `dataframe.data` to begin printing with.
* `end` (optional)—zero-based index of the entry in `dataframe.data` to terminate printing with.

### `dataframe.readData(input)`

Processes a CSV string or clones an array of arrays and assigns the result to `dataframe.data`.

#### Parameters

* `input`—a CSV file that is read into memory as a string or an array of arrays, where each subarray corresponds to a row in the CSV data.

### `dataframe.replace(header, dictionary)`

Replaces the string values in a given column according to the dictionary provided.

#### Parameters

* `header`—the header of the column to operate on as a string.
* `dictionary`—an object whose keys are strings to be replaced with the corresponding values.

### `dataframe.select(headers)`

Selects the columns with the column headers or index/indices given and returns a new data object containing those columns.

#### Parameters

* `headers`—an array of column headers or indices.

### `dataframe.shuffle()`

An implementation of the Durstenfeld shuffle algorithm for shuffling the entries in `dataframe.data`.

### `dataframe.standardise()`\/`dataframe.standardize()`

Creates a new dataframe object with features scaled to have (as close as possible) zero mean and unit variance. The standardised value is caculated as follows:

```
x' = (x - μ) / σ
```

Where `x'` is the scaled value, `x` the initial value, `μ` the sample mean, and `σ` the sample standard deviation.

#### Return value

A new dataframe object with scaled data.

### `dataframe.transpose()`

Creates an array of features for each of the columns in `dataframe.data`.

#### Return value

An object of which each property corresponds to a header in `dataframe.headers` and its values is an array of the corresponding values in `dataframe.data`.

### `dataframe.tail(rows)`

Prints the last few rows of, and always ending with the last row in, `dataframe.data` to the console.

#### Parameters

* `rows` (optional, default: `5`)—the number of rows to be printed.

## Scatter Plot React Component

A scatter chart React component was created for visualising data. There are certainly libraries for constructing scatter plots, but I was curious and it seemed like an interesting learning exercise—so I made my own.







----
