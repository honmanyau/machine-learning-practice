interface ISite {
  spin: -1 | 1;
  state: number | null;
}

interface IOptions {
  k?: number;
  J?: number;
  T?: number;
}

class IsingModel {
  public spins: ISite[][];
  public size: number;
  public hamiltonian: number;
  public magnetisation: number;
  public k: number;
  public J: number;
  public T: number;
  public Tc: number;
  public β: number;

  constructor(size: number, options: IOptions = {}) {
    this.size = size;
    this.k = options.k || 1; // Redefining temperature to J/kB
    this.J = options.J || 1;
    this.T = options.T || 0.01;

    this.calculateTc();
    this.calculateβ();

    this.generateInitialState();
    this.calculateSystemProperties();
  }

  /**
   * This method caluclates the hamiltonian and magnetisation of the current
   * configuration and store them in {@code this.hamiltonian} and
   * {@code this.magnetisation} respectively. It is important to note that each
   * interaction between two spins is only considered once for hamiltonian
   * calculation. The properties are calculated in a single method to reduce
   * the need for additional loops.
   */
  public calculateSystemProperties = (): void => {
    const { size, J, calculateSiteΣσj } = this;
    let spinTotal = 0;
    let Σσiσj = 0;

    this.spins.forEach((row, rowIndex) => {
      row.forEach((site, colIndex) => {
        const siteΣσj = calculateSiteΣσj(rowIndex, colIndex);

        Σσiσj += site.spin * siteΣσj / 2;
        spinTotal += site.spin;
        site.state = site.spin * siteΣσj;
      });
    });

    this.magnetisation = spinTotal / (size ** 2);
    this.hamiltonian = -J * Σσiσj;
  };

  /**
   * This method applies the Metropolis-Hasting algorithm to every single spin
   * in {@code this.spins}. The Durstenfeld shuffling algorithm is used to
   * randomise spin sampling as it is not entirely clear if sweeping in the same
   * order every time, simply by incrementing the row and column indicies with
   * 2 for loops, would lead to unintended bias.
   */
  public metropolisSweep = (iterations: number = 1): void => {
    for (let i = 0; i < iterations; i++) {
      const { spins, J, β } = this;
      const { calculateSiteΣσj, calculateTc, calculateβ } = this;
      const rowIndicies = this.generateRandomIndicies(this.size);

      calculateTc();
      calculateβ();

      rowIndicies.forEach((rowIndex) => {
        const colIndicies = this.generateRandomIndicies(this.size);

        colIndicies.forEach((colIndex) => {
          const site = spins[rowIndex][colIndex];
          const siteΣσj = calculateSiteΣσj(rowIndex, colIndex);
          const state = site.spin * siteΣσj;
          const flippedState = -site.spin * siteΣσj;
          const ΔH = -J * (flippedState - state);

          if (ΔH < 0) {
            site.spin *= -1;
          }
          else {
            // Calculate the acceptance probability of the flipped state and
            // flip accordingly. If a randomly-generated number, p, is within the
            // bounds of Α, flip the spin.
            const A = Math.exp(-β * ΔH);
            const p = Math.random();

            if (p < A) {
              site.spin *= -1;
            }
          }

          site.state = site.spin * siteΣσj;
        });
      });

      this.calculateSystemProperties();
    }
  }

  /**
   * This method calculates Tc and assign the result to {@code this.Tc}.
   */
  private calculateTc = (): void => {
    this.Tc = (this.J * 2) / (this.k * Math.log(1 + Math.sqrt(2)));
  };

  /**
   * This method calculates the sum of all neighbouring spins for a given site.
   * @param {number} rowIndex The row index of a given site
   * @param {number} colIndex The col index of a given site
   * @returns {number} The sum of all neighbouring spins of a given site
   */
  private calculateSiteΣσj = (rowIndex: number, colIndex: number): number => {
    const { spins, mod, size } = this;
    const σjLeft = spins[rowIndex][mod(colIndex - 1, size)].spin;
    const σjRight = spins[rowIndex][mod(colIndex + 1, size)].spin;
    const σjUp = spins[mod(rowIndex - 1, size)][colIndex].spin;
    const σjDown = spins[mod(rowIndex + 1, size)][colIndex].spin;

    return σjLeft + σjRight + σjUp + σjDown;
  };

  /**
   * This method calculates β and assign the result to {@code this.β}.
   */
  private calculateβ = (): void => {
    this.β = (this.k * this.T) ** -1;
  };

  /**
   * This method generates a configuration with randomised spins and assign
   * the result to {@code this.spins}.
   */
  private generateInitialState = (): void => {
    // Create an array of {@code this.size} subarrays, where each subarray
    // contains the data for a site according to the interface {@code ISite}.
    this.spins = Array.from({ length: this.size }).map(() => {
      const row = Array.from({ length: this.size }).map(() => {
        const site: ISite = {
          spin: Math.random() < 0.5 ? 1 : -1,
          state: null
        };

        return site;
      })

      return row;
    });

    this.calculateSystemProperties();
  };

  /**
   * This method is an implementation of the Durstenfeld shuffle algorithm.
   */
  private generateRandomIndicies = (size: number): number[] => {
    const indicies = Array.from({ length: size }).map((v, i) => i);

    for (let i = this.size - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [indicies[i], indicies[j]] = [indicies[j], indicies[i]];
    }

    return indicies;
  };

  /**
   * This method is a "proper" modulo implementation that takes into account
   * the sign of the operands.
   */
  private mod = (dividend: number, divisor: number): number => {
    const absDivisor = Math.abs(divisor);

    return ((dividend % absDivisor) + absDivisor) % absDivisor;
  };
}

export default IsingModel;
