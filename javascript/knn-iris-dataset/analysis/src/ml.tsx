import KNN from 'ml-knn';

import irisData from './data/all';
import { createDataframe } from './dataframe/dataframe';

function ml() {
  // ====================
  // == Configurations ==
  // ====================
  const iterations = 2;
  const kMin = 1;
  const kMax = 21;
  const trainingSize = 0.7;
  const summaryStrings = [];
  const tinit = window.performance.now();

  // ==========
  // == Main ==
  // ==========
  for (let k = kMin; k < kMax; k++) {
    const rates = [];
    const init = window.performance.now();

    for (let i = 0; i < iterations; i++) {
      const iris = createDataframe(irisData);

      // Data preparation
      iris.headers = [
        'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
      ];
      iris.shuffle();
      iris.standardise();

      const splitIndex = Math.floor(iris.data.length / 3 * trainingSize);
      const irisTraining = iris.clone();
      const irisValidation = iris.clone();

      const setosa = iris.filter({ Species: 'setosa' });
      const virginica = iris.filter({ Species: 'virginica' });
      const versicolor = iris.filter({ Species: 'versicolor' });

      irisTraining.data = [
        ...setosa.data.slice(0, splitIndex),
        ...virginica.data.slice(0, splitIndex),
        ...versicolor.data.slice(0, splitIndex)
      ];
      irisValidation.data = [
        ...setosa.data.slice(splitIndex),
        ...virginica.data.slice(splitIndex),
        ...versicolor.data.slice(splitIndex)
      ];

      const featureHeaders = [
        'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'
      ];
      const labelHeader = 'Species';
      const xTraining = irisTraining.select(featureHeaders).data;
      const yTraining = irisTraining.transpose()[labelHeader];
      const xValidation = irisValidation.select(featureHeaders).data;
      const yValidation = irisValidation.transpose()[labelHeader];

      // Model training
      const model = new KNN(xTraining, yTraining, { k });
      const predicted = model.predict(xValidation);

      // Calculate accuracy
      const correct = (
        predicted.reduce((acc: number, value: number, index: number) => {
          return acc + Number(value === yValidation[index]);
        }, 0)
      );
      const rate = correct / predicted.length;

      rates.push(rate);
    }

    console.log(`k = ${k}`);
    console.log(`${(window.performance.now() - init) / iterations} ms`);
    console.log(
      Array.from(new Set(rates))
        .map((value) => Math.round(value * 100))
        .sort((a, b) => b - a)
    );

    const rateDataframe = createDataframe(rates.map(value => [value * 100]));
    const stats = rateDataframe.describe()[0] as any;
    const { count, mean, variance, sd, min, max } = stats;
    const summaryString = [
      `|`,
      ` ${k} |`,
      ` ${count} |`,
      ` ${mean.toFixed(2)} |`,
      `  ${variance.toFixed(2)}  |`,
      ` ${sd.toFixed(2)} |`,
      ` ${min.toFixed(2)} |`,
      ` ${Number(max) === 100 ? 100 : max.toFixed(2)} |`,
    ].join('');

    summaryStrings.push(summaryString);
  }

  console.log(summaryStrings.join('\n'));
  console.log(`Finished! ${window.performance.now() - tinit} ms.`);
}

export default ml;
