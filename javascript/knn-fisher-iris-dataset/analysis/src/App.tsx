// import KNN from 'ml-knn';
import * as React from 'react';
import styled from 'styled-components';

import irisData from './data/all';
import { createDataframe } from './dataframe/dataframe';

import Scatter from './Scatter';

const iris = createDataframe(irisData);

iris.headers = [
  'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
];

const setosa = iris.filter({ Species: 'setosa' });
const virginica = iris.filter({ Species: 'virginica' });
const versicolor = iris.filter({ Species: 'versicolor' });

const setosaTransposed = setosa.transpose();
const virginicaTransposed = virginica.transpose();
const versicolorTransposed = versicolor.transpose();

// const iterations = 10000;
//
// for (let k = 1; k < 26; k++) {
//   const rates = [];
//   const init = window.performance.now();
//
//   for (let i = 0; i < iterations; i++) {
//     const irisP = createDataframe(irisData);
//
//     irisP.headers = [
//       'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
//     ];
//
//     irisP.replace('Species', { setosa: 0, virginica: 1, versicolor: 2 });
//     irisP.shuffle();
//     irisP.standardise();
//
//     const halfCount = Math.floor(irisP.data.length / 2);
//     const irisTraining = irisP.clone();
//     const irisValidation = irisP.clone();
//
//     irisTraining.data.splice(0, halfCount);
//     irisValidation.data.splice(halfCount);
//
//     const featureHeaders = [
//       'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'
//     ];
//     const labelHeader = 'Species';
//     const irisTrainingFeatures = irisTraining.select(featureHeaders).data;
//     const irisTrainingLabels = irisTraining.transpose()[labelHeader];
//     const irisValidationFeatures = irisValidation.select(featureHeaders).data;
//     const irisValidationLabels = irisValidation.transpose()[labelHeader];
//
//     const model = new KNN(irisTrainingFeatures, irisTrainingLabels, { k });
//     const predicted = model.predict(irisValidationFeatures);
//
//     const correct = predicted.reduce((acc: number, value: number, index: number) => {
//       return acc + Number(value === irisValidationLabels[index]);
//     }, 0);
//     const rate = correct / predicted.length;
//
//     rates.push(rate);
//   }
//
//   console.log(`k = ${k}`);
//   console.log(`${(window.performance.now() - init) / iterations} ms`);
//
//   const rateDataframe = createDataframe(rates.map(value => [value]));
//
//   rateDataframe.describe();
// }

const Container = styled.div`
  margin: 1em auto;
  padding: 1em 1.414em;
  width: 100%;
  max-width: 680px;
  border-radius: 4px;
  box-shadow: 0px 0px 4px 0px #CCC;
`;

const colours = {
  setosa: 'rgba(65, 105, 225, 0.4)',
  virginica: 'rgba(35, 142, 35, 0.4)',
  versicolor: 'rgba(255, 127, 0, 0.4)'
};

class App extends React.Component {
  public render() {
    return (
      <Container>
        <h3>KNN Classification of Fisher's Iris Dataset</h3>
        <Scatter
          data={[
            {
              x: setosaTransposed['Sepal Width'],
              y: setosaTransposed['Sepal Length'],
              colour: colours.setosa
            },
            {
              x: virginicaTransposed['Sepal Width'],
              y: virginicaTransposed['Sepal Length'],
              colour: colours.virginica
            },
            {
              x: versicolorTransposed['Sepal Width'],
              y: versicolorTransposed['Sepal Length'],
              colour: colours.versicolor
            }
          ]}
          title="Sepal Length vs. Sepal Width of All Species"
          xAxisLabel="Sepal Width"
          yAxisLabel="Sepal Length"
        />

        <Scatter
          data={[
            {
              x: setosaTransposed['Petal Length'],
              y: setosaTransposed['Sepal Length'],
              colour: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Length'],
              y: virginicaTransposed['Sepal Length'],
              colour: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Length'],
              y: versicolorTransposed['Sepal Length'],
              colour: colours.versicolor
            }
          ]}
          title="Sepal Length vs. Petal Length of All Species"
          xAxisLabel="Petal Length"
          yAxisLabel="Sepal Length"
        />

        <Scatter
          data={[
            {
              x: setosaTransposed['Petal Width'],
              y: setosaTransposed['Sepal Length'],
              colour: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Width'],
              y: virginicaTransposed['Sepal Length'],
              colour: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Width'],
              y: versicolorTransposed['Sepal Length'],
              colour: colours.versicolor
            }
          ]}
          title="Sepal Length vs. Petal Width of All Species"
          xAxisLabel="Petal Width"
          yAxisLabel="Sepal Length"
        />

        <Scatter
          data={[
            {
              x: setosaTransposed['Petal Length'],
              y: setosaTransposed['Sepal Width'],
              colour: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Length'],
              y: virginicaTransposed['Sepal Width'],
              colour: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Length'],
              y: versicolorTransposed['Sepal Width'],
              colour: colours.versicolor
            }
          ]}
          title="Sepal Width vs. Petal Length of All Species"
          xAxisLabel="Petal Length"
          yAxisLabel="Sepal Width"
        />

        <Scatter
          data={[
            {
              x: setosaTransposed['Petal Width'],
              y: setosaTransposed['Sepal Width'],
              colour: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Width'],
              y: virginicaTransposed['Sepal Width'],
              colour: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Width'],
              y: versicolorTransposed['Sepal Width'],
              colour: colours.versicolor
            }
          ]}
          title="Sepal Width vs. Petal Width of All Species"
          xAxisLabel="Petal Width"
          yAxisLabel="Sepal Width"
        />

        <Scatter
          data={[
            {
              x: setosaTransposed['Petal Width'],
              y: setosaTransposed['Petal Length'],
              colour: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Width'],
              y: virginicaTransposed['Petal Length'],
              colour: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Width'],
              y: versicolorTransposed['Petal Length'],
              colour: colours.versicolor
            }
          ]}
          title="Petal Length vs. Petal Width of All Species"
          xAxisLabel="Petal Width"
          yAxisLabel="Petal Length"
        />
      </Container>
    );
  }
}

export default App;
