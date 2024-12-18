import React, { useRef, useEffect, useState } from 'react';

import { chartColors } from './ChartjsConfig';
import {
  Chart,
  DoughnutController,
  ArcElement,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip);

function DoughnutChart({ data, width, height }) {
  const [chart, setChart] = useState<any>(null);
  const canvas = useRef<any>(null);
  const legend = useRef<any>(null);
  const {
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
        type: 'doughnut',
        data: data,
        options: {
          cutout: '80%',
          layout: {
            padding: 24,
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
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
          animation: {
            duration: 500,
          },
          maintainAspectRatio: false,
          resizeDelay: 200,
        },
        plugins: [
          {
            id: 'htmlLegend',
            // eslint-disable-next-line no-unused-vars
            afterUpdate(c: any, args, options) {
              const ul = legend.current;
              if (!ul) return;
              // Remove old legend items
              while (ul.firstChild) {
                ul.firstChild.remove();
              }
              // Reuse the built-in legendItems generator
              const items: any =
                c.options.plugins.legend.labels.generateLabels(c);
              items.forEach((item: any) => {
                const li = document.createElement('li');
                li.style.margin = '0.25rem';
                // Button element
                const button = document.createElement('button');
                button.classList.add(
                  'btn-xs',
                  'bg-white',
                  'dark:bg-slate-800',
                  'text-slate-500',
                  'dark:text-slate-400',
                  'border',
                  'border-slate-200',
                  'dark:border-slate-700',
                  'shadow-md',
                );
                button.style.opacity = item.hidden ? '.3' : '';
                button.style.display = 'flex';
                button.style.justifyContent = 'center';
                button.style.alignItems = 'center';
                button.onclick = () => {
                  c.toggleDataVisibility(item.index);
                  c.update();
                };
                // Color box
                const box = document.createElement('span');
                box.style.display = 'block';
                box.style.width = '0.5rem';
                box.style.height = '0.5rem';
                box.style.backgroundColor = item.fillStyle;
                box.style.borderRadius = '0.125rem';
                box.style.margin = '0.25rem';
                box.style.pointerEvents = 'none';
                // Label
                const label = document.createElement('span');
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                const labelText = document.createTextNode(item.text);
                label.appendChild(labelText);
                li.appendChild(button);
                button.appendChild(box);
                button.appendChild(label);
                ul.appendChild(li);
              });
            },
          },
        ],
      });
      setChart(newChart);
      return () => newChart.destroy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chart) return;
    chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
    chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
    chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
    chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    chart.update('none');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grow flex flex-col justify-center">
      <div>
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
      <div className="px-5 pt-2 pb-6">
        <ul ref={legend} className="flex flex-wrap justify-center -m-1"></ul>
      </div>
    </div>
  );
}

export default DoughnutChart;
