import { observer } from 'mobx-react';
import * as React from 'react';

import store from './store';

interface IMousePos {
  x: number;
  y: number;
}

const styles = {
  default: {
    margin: 'auto',
    boxShadow: '0 0 2px 2px #CCC inset'
  }
};

class HandwritingCanvas extends React.Component<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  React.ComponentState
> {
  private canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  private lineWidth = 20;
  private strokeStyle = '#333';
  private shadowColor = '#333';
  private shadowBlur = this.lineWidth / 4;

  constructor(props: React.CanvasHTMLAttributes<HTMLCanvasElement>) {
    super(props);

    this.state = {
      mousedown: false
    };

    store.setClearCanvas(this.clearCanvas);
    store.setSaveCanvas(this.saveCanvas);
  }

  public handleWritingStart = (
    event: React.MouseEvent | React.TouchEvent
  ): void => {
    event.preventDefault();

    const mousePos = this.getMosuePositionOnCanvas(event);
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvasContext.beginPath();

    canvasContext.moveTo(mousePos.x, mousePos.y);

    canvasContext.lineWidth = this.lineWidth;
    canvasContext.strokeStyle = this.strokeStyle;
    canvasContext.shadowColor = '';
    canvasContext.shadowBlur = 0;

    canvasContext.fill();

    this.setState({ mousedown: true });
  };

  public handleWritingInProgress = (
    event: React.MouseEvent | React.TouchEvent
  ): void => {
    event.preventDefault();

    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (this.state.mousedown) {
      const mousePos = this.getMosuePositionOnCanvas(event);

      canvasContext.lineTo(mousePos.x, mousePos.y);
      canvasContext.stroke();
    }
  };

  public handleDrawingEnd = (
    event: React.MouseEvent | React.TouchEvent
  ): void => {
    event.preventDefault();

    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (this.state.mousedown) {
      canvasContext.shadowColor = this.shadowColor;
      canvasContext.shadowBlur = this.shadowBlur;

      canvasContext.stroke();
    }

    this.setState({ mousedown: false });
  };

  // Helper methods
  public getMosuePositionOnCanvas = (
    event: React.MouseEvent | React.TouchEvent
  ): IMousePos => {
    event.preventDefault();

    const clientX =
      (event as React.MouseEvent).clientX ||
      (event as React.TouchEvent).touches[0].clientX;
    const clientY =
      (event as React.MouseEvent).clientY ||
      (event as React.TouchEvent).touches[0].clientY;
    const { offsetLeft, offsetTop } = event.target as HTMLCanvasElement;
    const canvasX = clientX - offsetLeft;
    const canvasY = clientY - offsetTop;

    return { x: canvasX, y: canvasY };
  };

  public clearCanvas = (): void => {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  };

  public saveCanvas = (): void => {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const tCanvas = document.createElement('canvas');
    const tCanvasContext = tCanvas.getContext('2d') as CanvasRenderingContext2D;
    const tCanvasSize = 25;

    tCanvas.width = tCanvasSize;
    tCanvas.height = tCanvasSize;
    tCanvasContext.drawImage(canvas, 0, 0, tCanvasSize, tCanvasSize);

    store.addData({
      imageData: tCanvasContext.getImageData(0, 0, tCanvasSize, tCanvasSize),
      imageURI: tCanvas.toDataURL()
    });

    this.clearCanvas();
  }

  public render() {
    return (
      <canvas
        ref={this.canvasRef}
        onMouseDown={this.handleWritingStart}
        onMouseMove={this.handleWritingInProgress}
        onMouseUp={this.handleDrawingEnd}
        onMouseOut={this.handleDrawingEnd}
        onTouchStart={this.handleWritingStart}
        onTouchMove={this.handleWritingInProgress}
        onTouchEnd={this.handleDrawingEnd}
        style={styles.default}
        {...this.props}
      />
    );
  }
}

export default observer(HandwritingCanvas);
