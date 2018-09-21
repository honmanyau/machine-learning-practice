import * as React from 'react';

import IsingModel from './simulation';

const init = window.performance.now();
const isingModel = new IsingModel(100, { T: 1E-12 });

isingModel.metropolisSweep(1000);
console.log(window.performance.now() - init);
console.log(isingModel);

class App extends React.Component {
  public render() {
    return (
      <div>
        Nya
      </div>
    );
  }
}

export default App;
