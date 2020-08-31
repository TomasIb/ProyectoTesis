import React from 'react';
import Title from './Title';
import { ResponsiveContainer } from 'recharts'
import { ResponsiveLine } from '@nivo/line'

const LineChart = ({ data, colors }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 5, right: 175, bottom: 75, left: 60}}
    xScale={{ type: 'linear' }}
    yScale={{ type: 'linear', min: 0, max: 1, stacked: false, reverse: false }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'False Positive Rate',
      legendOffset: 30,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'True Positive Rate',
      legendOffset: -40,
      legendPosition: 'middle'
    }}
    colors={colors}
    enablePoints={false}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabel="y"
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1
            }
          }
        ]
      }
    ]}
    motionStiffness={210}
  />
)


export default function Chart(props) {
  return (
    <React.Fragment>      
      <Title>ROC Curve By Algorithm</Title>
      <ResponsiveContainer>
         <LineChart data={props.data} colors={props.colors} />
      </ResponsiveContainer>      
    </React.Fragment>
  );
}

