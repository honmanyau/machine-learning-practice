import * as tf from '@tensorflow/tfjs';
import store, { IStoreData } from '../store';

// ====================
// == Configurations ==
// ====================
const TYPES_OF_CHARACTERS = 10;

function cnn(): void{
  // ====================
  // == Configurations ==
  // ====================
  const LEARNING_RATE = 0.15;
  const BATCH_SIZE = 10;

  // ============
  // == Layers ==
  // ============
  const inputLayer = tf.layers.conv2d({
    inputShape: [25, 25, 1],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling'
  });
  const hiddenLayer1 = tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2]
  });
  const hiddenLayer2 = tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling'
  });
  const hiddenLayer3 = tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2]
  });
  const flattenLayer = tf.layers.flatten();
  const outputLayer = tf.layers.dense({
    units: 10,
    kernelInitializer: 'VarianceScaling',
    activation: 'softmax'
  });

  // ==========
  // == Main ==
  // ==========
  const model = tf.sequential();

  model.add(inputLayer);
  model.add(hiddenLayer1);
  model.add(hiddenLayer2);
  model.add(hiddenLayer3);
  model.add(flattenLayer);
  model.add(outputLayer);
  model.compile({
    optimizer: tf.train.sgd(LEARNING_RATE),
    loss: 'categoricalCrossentropy',
    metrics: [ 'accuracy' ],
  });

  (async function() {
    const iterations = Math.floor(store.data.length / BATCH_SIZE / 2);
    const xsArray: any[] = [];
    let xs: any[] = [];
    let ys: any[] = [];
    let xv: any[] = [];
    let yv: any[] = [];

    for (let i = 0; i < iterations; i++) {
      const xsStartIndex = 2 * i * BATCH_SIZE;
      const xsEndIndex = xsStartIndex + BATCH_SIZE;
      const xvStartIndex = xsEndIndex;
      const xvEndIndex = xsEndIndex + BATCH_SIZE;

      xsArray.push(store.data.slice(xsStartIndex, xsEndIndex));
      xv.push(...store.data.slice(xvStartIndex, xvEndIndex));
    }

    yv = xv.map(storeDataToOneHotLabel);
    xv = xv.map(storeDataToFeature);

    for (let n = 0; n < 10; n++) {
      shuffle([ xsArray ]);
      xs = xsArray.reduce((acc, v) => acc.concat(v), []);
      ys = xs.map(storeDataToOneHotLabel);
      xs = xs.map(storeDataToFeature);

      for (let i = 0; i < iterations; i++) {
        const batchStartIndex = i * BATCH_SIZE;
        const batchEndIndex = i * BATCH_SIZE + BATCH_SIZE;
        const xsBatch = xs.slice(batchStartIndex, batchEndIndex);
        const ysBatch = ys.slice(batchStartIndex, batchEndIndex);

        shuffle([ xsBatch, ysBatch ]);

        const { history } = await model.fit(
          tf.tensor4d(xsBatch),
          tf.tensor2d(ysBatch),
          {
            batchSize: BATCH_SIZE,
            validationData: [ tf.tensor4d(xv), tf.tensor2d(yv) ],
            epochs: 1
          });

        console.log(history, history.loss[0], history.val_loss[0], history.acc[0], history.val_acc[0]);
      }
    }
  })();
}

function shuffle(arrays: any[][]): void {
  const l = arrays[0].length;

  for (let i = l - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      for (let k = 0; k < arrays.length; k++) {
        [arrays[k][i], arrays[k][j]] = [arrays[k][j], arrays[k][i]];
      }
  }
}

function storeDataToFeature(storeData: IStoreData) {
  // console.log(storeData);
  const { width, height, data } = storeData.imageData;
  const feature: number[][][] = [];

  for (let dy = 0; dy < height; dy++) {
    const row: number[][] = [];

    for (let dx = 0; dx < width; dx++) {
      const index  = (dx + dy * width) * 4;

      row.push([data[index] / 255]);
    }

    feature.push(row);
  }

  return feature;
}

function storeDataToOneHotLabel(storeData: IStoreData): number[] {
  const oneHot = Array.from({ length: TYPES_OF_CHARACTERS }).map(() => 0);

  oneHot[storeData.char] = 1;

  return oneHot;
}

export default cnn;
