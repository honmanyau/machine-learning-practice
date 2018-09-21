import * as React from 'react';

import IsingModel from './simulation';

const isingModel = new IsingModel(100);

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
