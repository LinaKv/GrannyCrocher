import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import type { ColorStatsRow } from '../colorStats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CHART_HEIGHT = 320;

interface RowComparisonChartProps {
  rows: ColorStatsRow[];
  rowIndices: number[];
}

export function RowComparisonChart({ rows, rowIndices }: RowComparisonChartProps) {
  const data = {
    labels: rowIndices.map((index) => `Ряд ${index + 1}`),
    datasets: rows.map((row) => ({
      label: row.label,
      data: rowIndices.map((index) => row.rowCounts[index] ?? 0),
      backgroundColor: row.hex,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="stats-page__chart" style={{ height: CHART_HEIGHT }}>
      <Bar data={data} options={options} />
    </div>
  );
}
