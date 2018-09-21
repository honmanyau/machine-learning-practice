# Ising Model Simulation

## Table of Contents

* [Introduction](#introduction)

## Introduction

This is an exercise guided by the details described in [arXiv:1605.01735v1](https://arxiv.org/pdf/1605.01735.pdf).

## 2D Ising Model Simulation

The Metropolis-Hasting algorithm is initially implemented for generating configurations that will be used for machine learning. The data representation used is simply an array of subarrays, where each subarray represents a row in the 2D Ising model, and each value in the subarray is the spin (-1 or +1) of at a given site of the model. For example:

```javascript
[
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1]
]
```
