# KNN Classification of Fisher's Iris Dataset

## Table of Contents

* [Introduction](#introduction)
* [Dataset](#dataset)

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

### Scripted Cleaning












//
