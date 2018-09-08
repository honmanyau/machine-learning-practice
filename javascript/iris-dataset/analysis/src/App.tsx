// import KNN from 'ml-knn';
import * as React from 'react';
import styled from 'styled-components';

import irisData from './data/all';
import { createDataframe } from './dataframe/dataframe';

import adamTraining from './data/adam-training';
import optimiserLoss from './data/optimiser-loss';

// import ml from './ml';
import Scatter from './Scatter';

// =============================
// == Data for Visualisation ===
// =============================
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

// =======================
// == Machine Learning ===
// =======================
// ml.knn();

// const iterations = 10;
// const results = [];
//
// for (let i = 0; i < iterations; i++) {
//   results.push(ml.nn());
// }
//
// Promise.all(results).then(d => console.log(d));
// (window as any).createDataframe = createDataframe;

// ============
// == React ===
// ============
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
  versicolor: 'rgba(255, 127, 0, 0.4)',
  adamTrainingAccuracy: 'rgba(65, 105, 225, 1)',
  adamTrainingLoss: 'rgba(0, 206, 209, 1)',
  adamValidationAccuracy: 'rgba(220, 20, 60, 0.6)',
  adamValidationLoss: 'rgba(255, 192, 203, 0.6)'
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
              fill: colours.setosa
            },
            {
              x: virginicaTransposed['Sepal Width'],
              y: virginicaTransposed['Sepal Length'],
              fill: colours.virginica
            },
            {
              x: versicolorTransposed['Sepal Width'],
              y: versicolorTransposed['Sepal Length'],
              fill: colours.versicolor
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
              fill: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Length'],
              y: virginicaTransposed['Sepal Length'],
              fill: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Length'],
              y: versicolorTransposed['Sepal Length'],
              fill: colours.versicolor
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
              fill: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Width'],
              y: virginicaTransposed['Sepal Length'],
              fill: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Width'],
              y: versicolorTransposed['Sepal Length'],
              fill: colours.versicolor
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
              fill: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Length'],
              y: virginicaTransposed['Sepal Width'],
              fill: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Length'],
              y: versicolorTransposed['Sepal Width'],
              fill: colours.versicolor
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
              fill: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Width'],
              y: virginicaTransposed['Sepal Width'],
              fill: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Width'],
              y: versicolorTransposed['Sepal Width'],
              fill: colours.versicolor
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
              fill: colours.setosa
            },
            {
              x: virginicaTransposed['Petal Width'],
              y: virginicaTransposed['Petal Length'],
              fill: colours.virginica
            },
            {
              x: versicolorTransposed['Petal Width'],
              y: versicolorTransposed['Petal Length'],
              fill: colours.versicolor
            }
          ]}
          title="Petal Length vs. Petal Width of All Species"
          xAxisLabel="Petal Width"
          yAxisLabel="Petal Length"
        />

        <Scatter
          data={[
            {
              x: optimiserLoss.sgd.map((value, index) => index + 1),
              y: optimiserLoss.sgd,
              fill: 'royalblue'
            },
            {
              x: optimiserLoss.adam.map((value, index) => index + 1),
              y: optimiserLoss.adam,
              fill: 'orange'
            }
          ]}
          title="Validation Loss vs. Epochs with Different Optimisers"
          xAxisLabel="Epoch"
          yAxisLabel="Training Loss"
          xMin={0}
          yMin={0}
          yMax={0.25}
          xDP={0}
          yDP={2}
        />

        <Scatter
          data={[
            {
              x: adamTraining.set5050.accuracy.map((value, index) => index + 1),
              y: adamTraining.set5050.accuracy,
              fill: colours.adamTrainingAccuracy
            },
            {
              x: adamTraining.set5050.validationAccuracy.map((value, index) => index + 1),
              y: adamTraining.set5050.validationAccuracy,
              fill: colours.adamValidationAccuracy
            }
          ]}
          title="Training and Validation Accuracy for an Adam Optimiser"
          xAxisLabel="Epoch"
          yAxisLabel="Training Loss"
          yTickIntervals={8}
          xMin={0}
          yMin={0.2}
          yMax={1}
          xDP={0}
          yDP={2}
        />

        <Scatter
          data={[
            {
              x: adamTraining.set5050.loss.map((value, index) => index + 1),
              y: adamTraining.set5050.loss,
              fill: 'none',
              stroke: colours.adamTrainingLoss
            },
            {
              x: adamTraining.set5050.validationLoss.map((value, index) => index + 1),
              y: adamTraining.set5050.validationLoss,
              fill: 'none',
              stroke: colours.adamValidationLoss
            }
          ]}
          title="Training and Validation Loss for an Adam Optimiser"
          xAxisLabel="Epoch"
          yAxisLabel="Training Loss"
          yTickIntervals={10}
          xMin={0}
          yMin={0}
          xDP={0}
          yDP={2}
        />
      </Container>
    );
  }
}

export default App;
