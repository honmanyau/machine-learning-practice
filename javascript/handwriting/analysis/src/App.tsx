import * as React from 'react';
import styled from 'styled-components';

// import { createDataframe } from './dataframe/dataframe';

// import ml from './ml';
// import Scatter from './Scatter';

import HandwritingCanvas from './HandwritingCanvas';

// import HandwritingCanvas from './HandwritingCanvas';

// =============================
// == Data for Visualisation ===
// =============================

// =======================
// == Machine Learning ===
// =======================

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

// const colours = {
//
// };

class App extends React.Component {
  public render() {
    return (
      <Container>
        <HandwritingCanvas width="300" height="300" />
      </Container>
    );
  }
}

export default App;
