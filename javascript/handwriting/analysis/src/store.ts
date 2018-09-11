import { Sequential } from '@tensorflow/tfjs';
import { action, configure, observable } from 'mobx';

import { getSeedData } from './data/seed-data';

configure({ enforceActions: 'always' });

export interface IData {
  imageData: ImageData;
  imageURI: string
}

export interface IStoreData extends IData {
  char: number;
}

export interface IStoreHistory {
  epoch: number[],
  accuracy: number[],
  loss: number[],
  validationAccuracy: number[],
  validationLoss: number[]
}

class Store {
  @observable public numbersToWrite: number[];
  @observable public data: IStoreData[];
  @observable public history: IStoreHistory;
  @observable public clearCanvas: () => void;
  @observable public saveCanvas: () => void;
  @observable public model: Sequential;

  @action public init = (): void => {
    this.numbersToWrite = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ];
    this.data = [];
    this.history = {
      epoch: [],
      accuracy: [],
      loss: [],
      validationAccuracy: [],
      validationLoss: []
    };
  }

  @action public regenerateNumbersToWrite = (): void => {
    if (!this.numbersToWrite.length) {
      this.numbersToWrite = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ];
    }
  }

  @action public setClearCanvas = (clearCanvas: () => void): void => {
    this.clearCanvas = clearCanvas;
  }

  @action public setSaveCanvas = (saveCanvas: () => void): void => {
    this.saveCanvas = saveCanvas;
  }

  @action public addData = (data: IData): void => {
    this.data.push({ ...data, char: this.numbersToWrite.shift() as number });
    this.regenerateNumbersToWrite();
  }

  @action public addSeedData = (data: IStoreData[]): void => {
    this.data = data;
  }

  @action public addHistory = (history: IStoreHistory): void => {
    Object.keys(this.history).forEach((key) => {
      this.history[key].push(...history[key]);
    });
  }

  @action public clearHistory = (): void => {
    this.history = {
      epoch: [],
      accuracy: [],
      loss: [],
      validationAccuracy: [],
      validationLoss: []
    };
  }

  @action public setModel = (model: Sequential): void => {
    this.model = model;
  }
}

const store = new Store();

getSeedData()
  .then((data: IStoreData[]) => store.addSeedData(data));

store.init();

(window as any).storee = store;
export default store;
