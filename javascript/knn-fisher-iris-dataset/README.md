# KNN Classification of Fisher's Iris Dataset

## Table of Contents

* [Introduction](#introduction)
* [Dataset](#dataset)
* [Data Preparation](#data-preparation)
  * [Manual Cleaning](#manual-cleaning)
  * [Automated Cleaning](#automated-cleaning)
  * [Converting to CSV Format](#converting-to-csv-format)

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








----
