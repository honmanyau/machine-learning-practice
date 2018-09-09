import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

// import { createDataframe } from './dataframe/dataframe';

import ml from './ml';
// import Scatter from './Scatter';

import store from './store';

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
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  justify-items: center;
  margin: 1em auto;
  padding: 1em 1.414em;
  width: 100%;
  max-width: 680px;
  border-radius: 4px;
  box-shadow: 0px 0px 4px 0px #CCC;
`;

const HandwritingControls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-variant: small-caps;
  font-size: 1.414rem;

  & > [type="button"] {
    margin-top: 1rem;
    padding: 0.5rem;
    width: 50%;
    min-width: 6rem;
    font-size: 1rem;
    border: 1px solid #CCC;
    border-radius: 4px;
    background: white;

    &:hover {
      background: #f3f3f3;
      cursor: pointer;
    }
  }
`;

const ImagesContainer = styled.div`
  max-width: 300px;
`;

class App extends React.Component {
  public handleClearCanvas = (): void => {
    store.clearCanvas();
  };

  public handleSaveCanvas = (): void => {
    store.saveCanvas();
  }

  public handleKeypress = (event: KeyboardEvent): void => {
    const { key } = event;

    if (key === 'Enter') {
      store.saveCanvas();
    }
  }

  public handleLearn = (): void => {
    ml.cnn();
  }

  public componentDidMount() {
    document.addEventListener('keypress', this.handleKeypress)
  }

  public render() {
    const images = store.data.map((data, index) => {
      const { char, imageURI } = data;
      const key = `img-${index}-${char}`;

      return (
        <img
          height="30" width="30" data-number={char} src={imageURI} key={key}
        />
      );
    });

    return (
      <Container>
        <HandwritingCanvas width="300" height="300" />
        <HandwritingControls>
          Current number:&nbsp;{store.numbersToWrite[0]}
          <input type="button" onClick={this.handleClearCanvas} value="Clear" />
          <input type="button" onClick={this.handleSaveCanvas} value="Save" />
          <input type="button" onClick={this.handleLearn} value="Learn" />
        </HandwritingControls>

        <ImagesContainer>{images}</ImagesContainer>
      </Container>
    );
  }
}

export default observer(App);
