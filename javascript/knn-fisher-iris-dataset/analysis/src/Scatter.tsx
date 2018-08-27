import * as React from 'react';
import styled from 'styled-components';

interface IData {
  x: number[],
  y: number[],
  colour?: string
}

interface IScatterProps extends React.HTMLAttributes<HTMLDivElement> {
  data: IData[],
  title: string,
  xAxisLabel: string,
  yAxisLabel: string,
  xTickIntervals?: number,
  yTickIntervals?: number
}

interface IXAxisLabel extends React.SVGAttributes<SVGTextElement> {
  leftPadding?: number;
  xPadding?: number;
}

interface IYAxisLabel extends React.SVGAttributes<SVGTextElement> {
  topPadding?: number;
  yPadding?: number;
}

const Container = styled.div`
  height: 500px;
  width: 500px;
`;
const Title = styled.text`
  font-size: 18px;
  text-anchor: middle;
  transform: translate(50%, 5%);
`;
const Line = styled.line`
  stroke-width: 2px;
  stroke: black;
`;
const XScaleLabel = styled.text`
  text-anchor: middle;
`;
const YScaleLabel = styled.text`
  text-anchor: end;
`;
const XAxisLabel = styled<IXAxisLabel, 'text'>('text')`
  text-anchor: middle;
  transform: translate(
    ${
      (props) => props.leftPadding && props.xPadding ?
        props.leftPadding + (100 - props.xPadding) / 2 :
        52
    }%,
    97%
  );;
`;
const YAxisLabel = styled<IYAxisLabel, 'text'>('text')`
  text-anchor: middle;
  transform: rotateZ(-90deg) translate(
    ${
      (props) => props.topPadding && props.yPadding ?
        -(props.topPadding + (100 - props.yPadding) / 2) :
        48
    }%,
    3%
  );
`;

const Scatter: React.SFC<IScatterProps> = ({
  data, title, xAxisLabel, yAxisLabel, xTickIntervals = 5, yTickIntervals = 5
}) => {
  // Setup
  const points: React.ReactNode[] = [];
  const xTicks: React.ReactNode[] = [];
  const yTicks: React.ReactNode[] = [];
  const xScale: React.ReactNode[] = [];
  const yScale: React.ReactNode[] = [];
  const leftPadding = 14;
  const rightPadding = 10;
  const topPadding = 10;
  const bottomPadding = 14;

  // Derived values
  const xPadding = leftPadding + rightPadding;
  const yPadding = topPadding + bottomPadding;
  const xPlotLength = 100 - xPadding;
  const yPlotLength = 100 - xPadding;
  const xPlotLengthScale = xPlotLength / 100;
  const yPlotLengthScale = yPlotLength / 100;

  // Calculated values
  let xMin: number = data[0].x[0];
  let xMax: number = data[0].x[0];
  let yMin: number = data[0].y[0];
  let yMax: number = data[0].y[0];
  let xRange: number;
  let yRange: number;

  for (const subset of data) {
    const { x, y } = subset;

    for (let i = 0; i < x.length; i++) {
      const px = x[i];
      const py = y[i];

      xMin = px < xMin ? px : xMin;
      xMax = px > xMax ? px : xMax;
      yMin = py < yMin ? py : yMin;
      yMax = py > yMax ? py : yMax;
    }
  }

  xRange = xMax - xMin;
  yRange = yMax - yMin;

  for (const subset of data) {
    const { x, y, colour } = subset;

    for (let i = 0; i < x.length; i++) {
      const px = x[i];
      const py = y[i];
      const xPos = (px - xMin) / xRange * 100;
      const yPos = (py - yMin) / yRange * 100;
      const xMappedPos = (leftPadding + xPos * xPlotLengthScale);
      const yMappedPos = (100 - bottomPadding - yPos * yPlotLengthScale);
      const cx = xMappedPos + '%';
      const cy = yMappedPos + '%';
      const r = 4;
      const fill = colour || 'black';

      points.push(
        <circle {...{cx, cy, r, fill, key: `circle-${colour}-${i}`}} />
      );
    }
  }

  for (let i = 0; i < xTickIntervals + 1; i++) {
    const xSpace = xPlotLength / xTickIntervals;
    const xTickX = leftPadding + i * xSpace;
    const tickLength = 1.2;
    const xTickProps = {
      x1: `${xTickX}%`,
      x2: `${xTickX}%`,
      y1: `${100 - bottomPadding}%`,
      y2: `${100 - bottomPadding + tickLength}%`,
      style: { transform: `translateX(${i === 0 ? 0 : -1}px)` },
      key: 'x-tick-' + i
    };
    const xLabelProps = {
      x: `${xTickX}%`,
      y: `${100 - bottomPadding + 4}%`,
      style: { transform: `translateX(${i === 0 ? 0 : -1}px)` },
      key: 'x-scale-' + i
    };
    const xLabelValue = (xMin + i * xRange / xTickIntervals).toFixed(1);

    xTicks.push(<Line {...xTickProps} />);
    xScale.push(<XScaleLabel {...xLabelProps}>{xLabelValue}</XScaleLabel>);
  }

  for (let i = 0; i < yTickIntervals + 1; i++) {
    const ySpace = yPlotLength / yTickIntervals;
    const yTickY = (100 - bottomPadding) - i * ySpace;
    const tickLength = 1.2;
    const yTickProps = {
      x1: `${leftPadding}%`,
      x2: `${leftPadding - tickLength}%`,
      y1: `${yTickY}%`,
      y2: `${yTickY}%`,
      style: { transform: `translateX(${i === 0 ? 0 : 1}px)` },
      key: 'y-tick-' + i
    };
    const yLabelProps = {
      x: `${leftPadding - 2}%`,
      y: `${yTickY}%`,
      dy: '0.32em',
      style: { transform: `translateX(${i === 0 ? 0 : 1}px)` },
      key: 'y-scale-' + i
    };
    const yLabelValue = (yMin + i * yRange / yTickIntervals).toFixed(1);

    yTicks.push(<Line {...yTickProps} />);
    yScale.push(<YScaleLabel {...yLabelProps}>{yLabelValue}</YScaleLabel>);
  }

  const xAxisProps = {
    x1: `${leftPadding}%`,
    x2: `${100 - rightPadding}%`,
    y1: `${100 - bottomPadding}%`,
    y2: `${100 - bottomPadding}%`
  };
  const yAxisProps = {
    x1: `${leftPadding}%`,
    x2: `${leftPadding}%`,
    y1: `${100 - bottomPadding}%`,
    y2: `${topPadding}%`
  };
  const xAxisLabelProps = { leftPadding, xPadding };
  const yAxisLabelProps = { topPadding, yPadding };

  return (
    <Container>
      <svg height="100%" width="100%">
        <Title>{title}</Title>

        <Line {...xAxisProps} />
        <g>{xTicks}</g>
        <g>{xScale}</g>
        <XAxisLabel {...xAxisLabelProps}>{xAxisLabel}</XAxisLabel>


        <Line {...yAxisProps} />
        <g>{yTicks}</g>
        <g>{yScale}</g>
        <YAxisLabel {...yAxisLabelProps}>{yAxisLabel}</YAxisLabel>

        {points}
      </svg>
    </Container>
  );
}

export default Scatter;
