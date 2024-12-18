import React from 'react';
import DoughnutChart from '../../charts/DoughnutChart';

function DashboardCard06() {
  const chartData = {
    labels: ['Draft', 'Open', 'Pending', 'Completed'],
    datasets: [
      {
        label: 'Event Status (in %)',
        data: [35, 30, 35, 10],
        backgroundColor: ['#6366F1', '#60a5fa', '#2E3A59', '#99e3fd'],
        hoverBackgroundColor: ['#4338CA', '#6366F1', '#120338', '#99e3fd'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Event Status (in %)
        </h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <DoughnutChart data={chartData} width={389} height={260} />
    </div>
  );
}

export default DashboardCard06;
