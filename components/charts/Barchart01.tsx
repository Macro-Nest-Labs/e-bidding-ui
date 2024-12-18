import React, { useRef, useEffect, useState } from 'react';
import { chartColors } from './ChartjsConfig';
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-moment';

// Import utilities
import { formatValue } from '../../utils/Utils';

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
);

function BarChart01({ data, width, height }) {
  const [chart, setChart] = useState<any>(null);
  const canvas = useRef(null);
  const legend = useRef(null);
  const {
    textColor,
    gridColor,
    tooltipBodyColor,
    tooltipBgColor,
    tooltipBorderColor,
  } = chartColors;

  useEffect(() => {
    if (canvas.current) {
      const ctx = canvas.current;
      // eslint-disable-next-line no-unused-vars
      const newChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          layout: {
            padding: {
              top: 12,
              bottom: 16,
              left: 20,
              right: 20,
            },
          },
          scales: {
            y: {
              border: {
                display: false,
              },
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
                parser: 'MM-DD-YYYY',
                unit: 'month',
                displayFormats: {
                  month: 'MMM YY',
                },
              },
              border: {
                display: false,
              },
              grid: {
                display: false,
              },
              ticks: {
                color: textColor.light,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: () => '', // Disable tooltip title
                label: (context) => formatValue(context.parsed.y),
              },
              bodyColor: tooltipBodyColor.light,
              backgroundColor: tooltipBgColor.light,
              borderColor: tooltipBorderColor.light,
            },
          },
          interaction: {
            intersect: false,
            mode: 'nearest',
          },
          animation: {
            duration: 500,
          },
          maintainAspectRatio: false,
          resizeDelay: 200,
        },
      });
      setChart(newChart);
      return () => newChart.destroy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chart) return;
    chart.options.scales.x.ticks.color = textColor.light;
    chart.options.scales.y.ticks.color = textColor.light;
    chart.options.scales.y.grid.color = gridColor.light;
    chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
    chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
    chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;

    chart.update('none');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <ul ref={legend} className="flex flex-wrap"></ul>
      </div>
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  );
}

export default BarChart01;
