import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import type { ColorStatsRow } from '../colorStats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const BAR_WIDTH = 72;
const CHART_HEIGHT = 320;

interface ColorsInRowChartProps {
  rows: ColorStatsRow[];
  rowIndex: number;
}

export function ColorsInRowChart({ rows, rowIndex }: ColorsInRowChartProps) {
  const data = {
    labels: rows.map((row) => row.label),
    datasets: [
      {
        data: rows.map((row) => row.rowCounts[rowIndex] ?? 0),
        backgroundColor: rows.map((row) => row.hex),
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="stats-page__chart">
      <div className="stats-page__chart-scroll" style={{ minWidth: rows.length * BAR_WIDTH, height: CHART_HEIGHT }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
