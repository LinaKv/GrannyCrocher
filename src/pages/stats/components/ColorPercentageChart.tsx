import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartOptions,
  type ScriptableContext,
} from 'chart.js';
import { hexToRgba } from '../../../utils/color';
import type { ColorStatsRow } from '../colorStats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const PRIMARY_BORDER_COLOR = '#44403c';
const BAR_WIDTH = 72;
const CHART_HEIGHT = 320;

interface ColorPercentageChartProps {
  rows: ColorStatsRow[];
}

export function ColorPercentageChart({ rows }: ColorPercentageChartProps) {
  const isPrimaryByIndex = rows.map((row) => row.isPrimary);

  const data = {
    labels: rows.map((row) => row.label),
    datasets: [
      {
        data: rows.map((row) => row.percentage),
        backgroundColor: rows.map((row) => (row.isPrimary ? hexToRgba(row.hex, 0.55) : row.hex)),
        borderColor: rows.map((row) => (row.isPrimary ? PRIMARY_BORDER_COLOR : 'transparent')),
        borderWidth: rows.map((row) => (row.isPrimary ? 2 : 0)),
        borderDash: (context: ScriptableContext<'bar'>) => (isPrimaryByIndex[context.dataIndex] ? [6, 4] : []),
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y?.toFixed(1)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `${value}%` },
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
