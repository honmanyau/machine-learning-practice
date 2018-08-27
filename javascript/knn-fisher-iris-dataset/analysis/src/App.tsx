import * as React from 'react';
import styled from 'styled-components';

import iridData from './data/all';
import { createDataframe } from './dataframe/dataframe';

import Scatter from './Scatter';

const iris = createDataframe(iridData);

iris.headers = [
  'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Species'
];

const setosa = iris.filter({ Species: 'setosa' });
const virginica = iris.filter({ Species: 'virginica' });
const versicolor = iris.filter({ Species: 'versicolor' });

iris.describe();
setosa.describe();
virginica.describe();
versicolor.describe();

const setosaColumns = setosa.transpose();
const virginicaColumns = virginica.transpose();
const versicolorColumns = versicolor.transpose();

const Container = styled.div`
  margin: 1em auto;
  padding: 1em 1.414em;
  width: 100%;
  max-width: 800px;
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
              x: setosaColumns['Sepal Width'],
              y: setosaColumns['Sepal Length'],
              colour: colours.setosa
            },
            {
              x: virginicaColumns['Sepal Width'],
              y: virginicaColumns['Sepal Length'],
              colour: colours.virginica
            },
            {
              x: versicolorColumns['Sepal Width'],
              y: versicolorColumns['Sepal Length'],
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
              x: setosaColumns['Petal Length'],
              y: setosaColumns['Sepal Length'],
              colour: colours.setosa
            },
            {
              x: virginicaColumns['Petal Length'],
              y: virginicaColumns['Sepal Length'],
              colour: colours.virginica
            },
            {
              x: versicolorColumns['Petal Length'],
              y: versicolorColumns['Sepal Length'],
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
              x: setosaColumns['Petal Width'],
              y: setosaColumns['Sepal Length'],
              colour: colours.setosa
            },
            {
              x: virginicaColumns['Petal Width'],
              y: virginicaColumns['Sepal Length'],
              colour: colours.virginica
            },
            {
              x: versicolorColumns['Petal Width'],
              y: versicolorColumns['Sepal Length'],
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
              x: setosaColumns['Petal Length'],
              y: setosaColumns['Sepal Width'],
              colour: colours.setosa
            },
            {
              x: virginicaColumns['Petal Length'],
              y: virginicaColumns['Sepal Width'],
              colour: colours.virginica
            },
            {
              x: versicolorColumns['Petal Length'],
              y: versicolorColumns['Sepal Width'],
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
              x: setosaColumns['Petal Width'],
              y: setosaColumns['Sepal Width'],
              colour: colours.setosa
            },
            {
              x: virginicaColumns['Petal Width'],
              y: virginicaColumns['Sepal Width'],
              colour: colours.virginica
            },
            {
              x: versicolorColumns['Petal Width'],
              y: versicolorColumns['Sepal Width'],
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
              x: setosaColumns['Petal Width'],
              y: setosaColumns['Petal Length'],
              colour: colours.setosa
            },
            {
              x: virginicaColumns['Petal Width'],
              y: virginicaColumns['Petal Length'],
              colour: colours.virginica
            },
            {
              x: versicolorColumns['Petal Width'],
              y: versicolorColumns['Petal Length'],
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
