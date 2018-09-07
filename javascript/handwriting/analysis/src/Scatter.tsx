import * as React from 'react';
import styled from 'styled-components';

interface IData {
  x: number[],
  y: number[],
  r?: number,
  fill?: string,
  stroke?: string
}

interface IScatterProps extends React.HTMLAttributes<HTMLDivElement> {
  data: IData[],
  title: string,
  xAxisLabel: string,
  yAxisLabel: string,
  xTickIntervals?: number,
  yTickIntervals?: number,
  xMin?: number,
  xMax?: number,
  yMin?: number,
  yMax?: number,
  xDP?: number,
  yDP?: number
}

// interface IXAxisLabel extends React.SVGAttributes<SVGTextElement> {
//   leftPadding?: number;
//   xPadding?: number;
// }
//
// interface IYAxisLabel extends React.SVGAttributes<SVGTextElement> {
//   topPadding?: number;
//   yPadding?: number;
// }

const Container = styled.div`
  height: 500px;
  width: 500px;
`;

const styles = {
  title: {
    fontSize: `18px`,
    textAnchor: 'middle' as 'middle'
  },
  line: {
    strokeWidth: '2px',
    stroke: 'black'
  },
  xAxisLabel: {
    textAnchor: 'middle' as 'middle'
  },
  yAxisLabel: {
    textAnchor: 'middle' as 'middle',
    transform: 'rotateZ(-90deg)'
  }
};

const Scatter: React.SFC<IScatterProps> = ({
  data, title,
  xAxisLabel, yAxisLabel,
  xMin = data[0].x[0], xMax = data[0].x[0],
  yMin = data[0].y[0], yMax = data[0].y[0],
  xTickIntervals = 5, yTickIntervals = 5,
  xDP = 1, yDP = 1
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
  const yPlotLength = 100 - yPadding;
  const xPlotLengthScale = xPlotLength / 100;
  const yPlotLengthScale = yPlotLength / 100;

  // Calculated values
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
    const { x, y, r: customR, fill: customFill, stroke: customStroke } = subset;

    for (let i = 0; i < x.length; i++) {
      const px = x[i];
      const py = y[i];
      const xPos = (px - xMin) / xRange * 100;
      const yPos = (py - yMin) / yRange * 100;
      const xMappedPos = (leftPadding + xPos * xPlotLengthScale);
      const yMappedPos = (100 - bottomPadding - yPos * yPlotLengthScale);
      const cx = xMappedPos + '%';
      const cy = yMappedPos + '%';
      const r = customR || 4;
      const fill = customFill || 'black';
      const stroke = customStroke || 'none';
      const key = `circle-${cx}-${cy}-${fill}-${stroke}-${i}`;

      points.push(
        <circle {...{cx, cy, r, fill, stroke, key }} />
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
      style: {
        textAnchor: 'middle' as 'middle',
        transform: `translateX(${i === 0 ? 0 : -1}px)`
      },
      key: 'x-scale-' + i
    };
    const xLabelValue = (xMin + i * xRange / xTickIntervals).toFixed(xDP);

    xTicks.push(<line {...xTickProps} style={styles.line} />);
    xScale.push(<text {...xLabelProps}>{xLabelValue}</text>);
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
      style: {
        textAnchor: 'end' as 'end',
        transform: `translateX(${i === 0 ? 0 : 1}px)`
      },
      key: 'y-scale-' + i
    };
    const yLabelValue = (yMin + i * yRange / yTickIntervals).toFixed(yDP);

    yTicks.push(<line {...yTickProps} style={styles.line} />);
    yScale.push(<text {...yLabelProps}>{yLabelValue}</text>);
  }

  const titleProps = {
    x: '50%',
    y: '5%'
  };
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
  const xAxisLabelProps = {
    x: `${leftPadding + (100 - xPadding) / 2}%`,
    y: '97%'
  };
  const yAxisLabelProps = {
    x: `-${topPadding + (100 - yPadding) / 2}%`,
    y: '3%'
  };

  return (
    <Container>
      <svg height="100%" width="100%" fontFamily="sans-serif">
        <text {...titleProps} style={styles.title}>{title}</text>

        <line {...xAxisProps} style={styles.line} />
        <g>{xTicks}</g>
        <g>{xScale}</g>
        <text {...xAxisLabelProps} style={styles.xAxisLabel}>{xAxisLabel}</text>

        <line {...yAxisProps} style={styles.line} />
        <g>{yTicks}</g>
        <g>{yScale}</g>
        <text {...yAxisLabelProps} style={styles.yAxisLabel}>{yAxisLabel}</text>

        <g>{points}</g>
      </svg>
    </Container>
  );
}

export default Scatter;
