import * as tf from '@tensorflow/tfjs';

import irisData from '../data/all';
import { createDataframe } from '../dataframe/dataframe';

function nn(): Promise<number> {
  // ====================
  // == Configurations ==
  // ====================
  const trainingSize = 0.5;
  const validationSize = 0.5;

  // ==========
  // == Main ==
  // ==========
  // Data preparation
  const iris = createDataframe(irisData);

  iris.headers = [
    'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
  ];
  iris.shuffle();

  const trainingValidationSplitIndex = Math.floor(iris.data.length / 3 * trainingSize);
  const validationTestSplitIndex = Math.floor(iris.data.length / 3 * (trainingSize + validationSize));
  const irisTraining = iris.clone();
  const irisValidation = iris.clone();
  const irisTest = iris.clone();

  const setosa = iris.filter({ Species: 'setosa' });
  const virginica = iris.filter({ Species: 'virginica' });
  const versicolor = iris.filter({ Species: 'versicolor' });

  irisTraining.data = [
    ...setosa.data.slice(0, trainingValidationSplitIndex),
    ...virginica.data.slice(0, trainingValidationSplitIndex),
    ...versicolor.data.slice(0, trainingValidationSplitIndex)
  ];
  irisValidation.data = [
    ...setosa.data.slice(trainingValidationSplitIndex, validationTestSplitIndex),
    ...virginica.data.slice(trainingValidationSplitIndex, validationTestSplitIndex),
    ...versicolor.data.slice(trainingValidationSplitIndex, validationTestSplitIndex)
  ];
  irisTest.data = [
    ...setosa.data.slice(validationTestSplitIndex),
    ...virginica.data.slice(validationTestSplitIndex),
    ...versicolor.data.slice( validationTestSplitIndex)
  ];

  const featureHeaders = [
    'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'
  ];
  const labelHeader = 'Species';
  const xTraining = irisTraining.select(featureHeaders).data;
  const yTraining = (
    irisTraining
      .transpose()[labelHeader]
      .map((species: string) => [
        Number(species === 'setosa'),
        Number(species === 'virginica'),
        Number(species === 'versicolor')
      ])
  );
  const xValidation = irisValidation.select(featureHeaders).data;
  const yValidation = (
    irisValidation
      .transpose()[labelHeader]
      .map((species: string) => [
        Number(species === 'setosa'),
        Number(species === 'virginica'),
        Number(species === 'versicolor')
      ])
  );

  // Tensorflow
  const xs = tf.tensor2d(xTraining);
  const ys = tf.tensor2d(yTraining);
  const model = tf.sequential();
  const inputLayer = tf.layers.dense({
    inputShape: [4],
    units: 4,
    activation: 'sigmoid'
  });
  const hiddenLayer = tf.layers.dense({
    units: 2,
    activation: 'sigmoid'
  });
  const outputLayer = tf.layers.dense({
    units: 3,
    activation: 'softmax'
  });

  model.add(inputLayer);
  model.add(hiddenLayer);
  model.add(outputLayer);
  model.compile({
    optimizer: tf.train.adam(0.02),
    loss: 'meanSquaredError',
    metrics: [ 'accuracy' ]
  });

  async function train() {
    const trainInit = performance.now();
    const data = {
      accuracy: [],
      loss: [],
      validationAccuracy: [],
      validationLoss: []
    } as {
      accuracy: any[];
      loss: any[];
      validationAccuracy: any[];
      validationLoss: any[];
    };

    for (let i = 0; i < 200; i++) {
      await (
        model
          .fit(xs, ys, {
            epochs: 1,
            validationData: [ tf.tensor2d(xValidation), tf.tensor2d(yValidation) ]
          })
          .then((res) => {
            const { acc, loss, val_acc, val_loss } = res.history;

            data.accuracy = data.accuracy.concat(acc);
            data.loss = data.loss.concat(loss);
            data.validationAccuracy = data.validationAccuracy.concat(val_acc);
            data.validationLoss = data.validationLoss.concat(val_loss);
          })
      );
    }

    console.log('Finished training: ', (performance.now() - trainInit) + 'ms');
    console.log(data);

    return data.validationAccuracy[data.validationAccuracy.length - 1];
  }

  return Promise.resolve(train());
}

// function shuffle(array: any[]): void {
//   for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//   }
// }

export default nn;
