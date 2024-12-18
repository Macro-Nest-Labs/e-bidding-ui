import React, { useRef, useEffect, useState } from 'react';
import { chartColors } from '@/components/charts/ChartjsConfig';

import {
  Chart,
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

// Import utilities
import { formatValue } from '../../utils/Utils';

Chart.register(
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
);

function RealtimeChart({ data, width, height, lowestBidAmount }) {
  const [chart, setChart] = useState<any>(null);
  const canvas = useRef<any>(null);
  const chartValue = useRef<any>(null);
  const chartDeviation = useRef<any>(null);
  const {
    textColor,
    gridColor,
    tooltipTitleColor,
    tooltipBodyColor,
    tooltipBgColor,
    tooltipBorderColor,
  } = chartColors;

  useEffect(() => {
    if (canvas.current) {
      const ctx = canvas.current;
      // eslint-disable-next-line no-unused-vars
      const newChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          layout: {
            padding: 20,
          },
          scales: {
            y: {
              border: {
                display: false,
              },
              suggestedMin: 30,
              suggestedMax: 80,
              ticks: {
                maxTicksLimit: 5,
                callback: (value: any) => formatValue(value),
                color: textColor.light,
              },
              grid: {
                color: gridColor.light,
              },
            },
            x: {
              type: 'time',
              time: {
                parser: 'hh:mm:ss',
                unit: 'second',
                tooltipFormat: 'MMM DD, H:mm:ss a',
                displayFormats: {
                  second: 'H:mm:ss',
                },
              },
              border: {
                display: false,
              },
              grid: {
                display: false,
              },
              ticks: {
                autoSkipPadding: 48,
                maxRotation: 0,
                color: textColor.light,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              titleFont: {
                weight: '600',
              },
              callbacks: {
                label: (context) => {
                  const value = formatValue(context.parsed.y);
                  const bidderName = context.dataset.label;
                  const formattedValue = `${value}`;
                  return `Bidder: ${bidderName}, Value: ${formattedValue}`;
                },
              },
              titleColor: tooltipTitleColor.light,
              bodyColor: tooltipBodyColor.light,
              backgroundColor: tooltipBgColor.light,
              borderColor: tooltipBorderColor.light,
            },
          },
          interaction: {
            intersect: false,
            mode: 'nearest',
          },
          animation: false,
          maintainAspectRatio: false,
        },
      });
      setChart(newChart);
      return () => newChart.destroy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Update header values
  useEffect(() => {
    // TODO: Replace the fallback 0 with starting auction price
    const currentValue = lowestBidAmount ? lowestBidAmount : 0; // fallback to 0 or starting auction price
    chartValue.current.innerHTML = currentValue;
  }, [lowestBidAmount]);

  useEffect(() => {
    if (!chart) return;
    chart.options.scales.x.ticks.color = textColor.light;
    chart.options.scales.y.ticks.color = textColor.light;
    chart.options.scales.y.grid.color = gridColor.light;
    chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
    chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
    chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
    chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;

    chart.update('none');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-black mr-2 tabular-nums">
            ₹<span ref={chartValue}>0</span>
          </div>
          <div
            ref={chartDeviation}
            className="text-sm font-semibold text-white px-1.5 rounded-full"
          ></div>
        </div>
      </div>
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  );
}

export default RealtimeChart;
