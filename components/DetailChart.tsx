import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js'
import 'chartjs-adapter-moment'
import { MonitorState, MonitorTarget } from '@/types/config'
import { codeToCountry } from '@/util/iata'
import { useTranslation } from 'react-i18next'
import { useMantineTheme } from '@mantine/core'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  TimeScale,
  Filler
)

export default function DetailChart({
  monitor,
  state,
}: {
  monitor: MonitorTarget
  state: MonitorState
}) {
  const { t } = useTranslation('common')
  const theme = useMantineTheme()
  const latencyData = state.latency[monitor.id].map((point) => ({
    x: point.time * 1000,
    y: point.ping,
    loc: point.loc,
  }))

  let data = {
    datasets: [
      {
        data: latencyData,
        borderColor: theme.colors.teal[6],
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 200)
          gradient.addColorStop(0, theme.colors.teal[2])
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          return gradient
        },
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: theme.colors.teal[6],
        fill: true,
        cubicInterpolationMode: 'monotone' as const,
        tension: 0.4,
      },
    ],
  }

  let options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animation: {
      duration: 0,
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { family: theme.fontFamily, weight: 'bold' },
        bodyFont: { family: theme.fontFamily },
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (item: any) => {
            if (item.parsed.y) {
              return `${item.parsed.y}ms (${codeToCountry(item.raw.loc)})`
            }
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        grid: {
          display: false,
        },
        ticks: {
          source: 'auto' as const,
          maxRotation: 0,
          autoSkip: true,
          font: { family: theme.fontFamily, size: 10 },
          color: theme.colors.gray[5],
        },
      },
      y: {
        grid: {
          color: theme.colors.gray[1],
          borderDash: [5, 5],
        },
        ticks: {
          font: { family: theme.fontFamily, size: 10 },
          color: theme.colors.gray[5],
        },
        beginAtZero: true,
      },
    },
  }

  return (
    <div style={{ height: '200px', marginTop: '10px' }}>
      <Line options={options} data={data} />
    </div>
  )
}
