// Import Chart.js
import { Chart, Tooltip } from 'chart.js';

// Import Tailwind config
import { hexToRGB } from '../../utils/Utils';

Chart.register(Tooltip);

// Define Chart.js default settings
Chart.defaults.font.family = '"Inter", sans-serif';
Chart.defaults.font.weight = '500';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.plugins.tooltip.mode = 'nearest';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.caretSize = 0;
Chart.defaults.plugins.tooltip.caretPadding = 20;
Chart.defaults.plugins.tooltip.cornerRadius = 4;
Chart.defaults.plugins.tooltip.padding = 8;

// Register Chart.js plugin to add a bg option for chart area
Chart.register({
  id: 'chartAreaPlugin',
  beforeDraw: (chart: Chart) => {
    if (
      chart.config.options &&
      (chart.config.options as any).chartArea &&
      (chart.config.options as any).chartArea.backgroundColor
    ) {
      const ctx = chart.canvas?.getContext('2d');
      const { chartArea } = chart.config.options as any;
      if (ctx) {
        ctx.save();
        ctx.fillStyle = (chart.config.options as any).chartArea.backgroundColor;
        ctx.fillRect(
          chartArea.left,
          chartArea.top,
          chartArea.right - chartArea.left,
          chartArea.bottom - chartArea.top,
        );
        ctx.restore();
      }
    }
  },
});

export const chartColors = {
  textColor: {
    light: '#94A3B8',
    dark: '#646F8B',
  },
  gridColor: {
    light: '#F1F5F9',
    dark: '#94A3B8',
  },
  backdropColor: {
    light: '#ffffff',
    dark: '#1E293B',
  },
  tooltipTitleColor: {
    light: '#1E293B',
    dark: '#F1F5F9',
  },
  tooltipBodyColor: {
    light: '#1E293B',
    dark: '#F1F5F9',
  },
  tooltipBgColor: {
    light: '#ffffff',
    dark: '#334155',
  },
  tooltipBorderColor: {
    light: '#E2E8F0',
    dark: '#4B5563',
  },
  chartAreaBg: {
    light: '#F9FAFB',
    dark: `rgba(${hexToRGB('#111827')}, 0.24)`,
  },
};
