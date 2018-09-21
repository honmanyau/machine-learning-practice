import IsingModel from './index';

describe('\ncalculateSystemProperties()', () => {
  const size = 4;
  const isingModel = new IsingModel(size);

  it([
    'should set the value of the hamiltonian property to -32, the',
    ' magnetisation property to 1, and the state property of every site to',
    ' be 4 for the following configuration:',
    '\n\t[  1,  1,  1,  1 ]',
    '\n\t[  1,  1,  1,  1 ]',
    '\n\t[  1,  1,  1,  1 ]',
    '\n\t[  1,  1,  1,  1 ]'
  ].join(''), () => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        isingModel.spins[y][x].spin = 1;
      }
    }

    isingModel.calculateSystemProperties();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        expect(isingModel.spins[y][x].state).toBe(4);
      }
    }

    expect(isingModel.hamiltonian).toBe(-(size * size * 2));
    expect(isingModel.magnetisation).toBe(1);
  });

  it([
    'should set the value of the hamiltonian property to -32, the',
    ' magnetisation property to 1, and the state property of every site to',
    ' be 4 for the following configuration:',
    '\n\t[ -1, -1, -1, -1 ]',
    '\n\t[ -1, -1, -1, -1 ]',
    '\n\t[ -1, -1, -1, -1 ]',
    '\n\t[ -1, -1, -1, -1 ]'
  ].join(''), () => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        isingModel.spins[y][x].spin = -1;
      }
    }

    isingModel.calculateSystemProperties();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        expect(isingModel.spins[y][x].state).toBe(4);
      }
    }

    expect(isingModel.hamiltonian).toBe(-(size * size * 2));
    expect(isingModel.magnetisation).toBe(-1);
  });

  it([
    'should set the value of the hamiltonian property to +32 and',
    ' the magnetisation property to 0, and the state property of every site to',
    ' be -4 for the following configuration:',
    '\n\t[  1, -1,  1, -1 ]',
    '\n\t[ -1,  1, -1,  1 ]',
    '\n\t[  1, -1,  1, -1 ]',
    '\n\t[ -1,  1, -1,  1 ]'
  ].join(''), () => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if ((x + y) % 2 === 0) {
          isingModel.spins[x][y].spin = 1;
        }
        else {
          isingModel.spins[x][y].spin = -1;
        }
      }
    }

    isingModel.calculateSystemProperties();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        expect(isingModel.spins[y][x].state).toBe(-4);
      }
    }

    expect(isingModel.hamiltonian).toBe(size * size * 2);
    expect(isingModel.magnetisation).toBe(0);
  });
});

describe('\metropolisSweep()', () => {
  const size = 3;
  const options = { T: 1E-12 };
  const isingModel = new IsingModel(size, options);

  it([
    'should turn the following configuration:',
    '\n\t[  1,  1,  1 ]',
    '\n\t[  1, -1,  1 ]',
    '\n\t[  1,  1,  1 ]',
    '\ninto the following configuration with the same computed hamiltonian and',
    ' magnetisation',
    '\n\t[  1,  1,  1 ]',
    '\n\t[  1,  1,  1 ]',
    '\n\t[  1,  1,  1 ]'
  ].join(''), () => {
    const refIsingModel = new IsingModel(size, options);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        isingModel.spins[y][x].spin = 1;
        refIsingModel.spins[y][x].spin = 1;
      }
    }

    isingModel.spins[1][1].spin = -1;

    isingModel.metropolisSweep();
    refIsingModel.calculateSystemProperties();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const spin = isingModel.spins[y][x].spin;
        const refSpin = refIsingModel.spins[y][x].spin;

        expect(spin).toEqual(refSpin);
      }
    }

    expect(isingModel.hamiltonian).toEqual(refIsingModel.hamiltonian);
    expect(isingModel.magnetisation).toBe(refIsingModel.magnetisation);
  });

  it([
    'should turn the following configuration:',
    '\n\t[ -1, -1, -1 ]',
    '\n\t[ -1,  1, -1 ]',
    '\n\t[ -1, -1, -1 ]',
    '\ninto the following configuration with the same computed hamiltonian and',
    ' magnetisation',
    '\n\t[ -1, -1, -1 ]',
    '\n\t[ -1, -1, -1 ]',
    '\n\t[ -1, -1, -1 ]',
  ].join(''), () => {
    const refIsingModel = new IsingModel(size, options);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        isingModel.spins[y][x].spin = -1;
        refIsingModel.spins[y][x].spin = -1;
      }
    }

    isingModel.spins[1][1].spin = 1;

    isingModel.metropolisSweep();
    refIsingModel.calculateSystemProperties();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const spin = isingModel.spins[y][x].spin;
        const refSpin = refIsingModel.spins[y][x].spin;

        expect(spin).toEqual(refSpin);
      }
    }

    expect(isingModel.hamiltonian).toEqual(refIsingModel.hamiltonian);
    expect(isingModel.magnetisation).toBe(refIsingModel.magnetisation);
  });

  it([
    'should turn the following configuration:',
    '\n\t[  1, -1, -1 ]',
    '\n\t[ -1, -1, -1 ]',
    '\n\t[ -1, -1, -1 ]',
    '\ninto the following configuration with the same computed hamiltonian and',
    ' magnetisation',
    '\n\t[ -1, -1, -1 ]',
    '\n\t[ -1, -1, -1 ]',
    '\n\t[ -1, -1, -1 ]',
  ].join(''), () => {
    const refIsingModel = new IsingModel(size, options);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        isingModel.spins[y][x].spin = -1;
        refIsingModel.spins[y][x].spin = -1;
      }
    }

    isingModel.spins[0][0].spin = -1;

    isingModel.metropolisSweep();
    refIsingModel.calculateSystemProperties();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const spin = isingModel.spins[y][x].spin;
        const refSpin = refIsingModel.spins[y][x].spin;

        expect(spin).toEqual(refSpin);
      }
    }

    expect(isingModel.hamiltonian).toEqual(refIsingModel.hamiltonian);
    expect(isingModel.magnetisation).toBe(refIsingModel.magnetisation);
  });
});
