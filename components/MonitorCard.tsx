import { Tooltip } from '@mantine/core'
import { IconCloud } from '@tabler/icons-react'
import { MonitorTarget, MonitorState } from '@/types/config'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { Stack, Text } from '@mantine/core'
const moment = require('moment')
require('moment-precise-range-plugin')

export default function MonitorCard({
  monitor,
  state,
}: {
  monitor: MonitorTarget
  state: MonitorState
}) {
  const { t } = useTranslation('common')
  const incident = state.incident[monitor.id]
  const status =
    incident && incident.length > 0 && incident[incident.length - 1].end === undefined
      ? 'down'
      : 'up'

  // Get latest latency
  const latencies = state.latency[monitor.id]
  const lastLatency =
    latencies && latencies.length > 0 ? latencies[latencies.length - 1].ping : null

  // Calculate uptime bars (last 30 days)
  const uptimeBars = []
  const currentTime = Math.round(Date.now() / 1000)
  const montiorStartTime = state.incident[monitor.id]
    ? state.incident[monitor.id][0].start[0]
    : currentTime
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  // Helper to calculate overlap
  const overlapLen = (x1: number, x2: number, y1: number, y2: number) => {
    return Math.max(0, Math.min(x2, y2) - Math.max(x1, y1))
  }

  let totalMonitorTime = 0
  let totalDownTime = 0

  for (let i = 29; i >= 0; i--) {
    const dayStart = Math.round(todayStart.getTime() / 1000) - i * 86400
    const dayEnd = dayStart + 86400
    const dayMonitorTime = overlapLen(dayStart, dayEnd, montiorStartTime, currentTime)
    let dayDownTime = 0

    if (state.incident[monitor.id]) {
      for (let incident of state.incident[monitor.id]) {
        const incidentStart = incident.start[0]
        const incidentEnd = incident.end ?? currentTime
        const overlap = overlapLen(dayStart, dayEnd, incidentStart, incidentEnd)
        dayDownTime += overlap
      }
    }

    if (dayMonitorTime > 0) {
      totalMonitorTime += dayMonitorTime
      totalDownTime += dayDownTime
    }

    const dayPercent =
      dayMonitorTime === 0 ? -1 : ((dayMonitorTime - dayDownTime) / dayMonitorTime) * 100

    // Determine color based on uptime
    let barColor = 'bg-gray-200' // gray-200 for No data
    if (dayPercent === 100) barColor = 'bg-emerald-400' // emerald-500
    else if (dayPercent >= 98) barColor = 'bg-emerald-300' // emerald-400
    else if (dayPercent >= 95) barColor = 'bg-amber-400' // amber-500
    else if (dayPercent >= 0) barColor = 'bg-rose-500' // red-500

    uptimeBars.push(
      <Tooltip
        key={i}
        label={
          <Stack gap={2} p={4}>
            <Text size="xs" fw={700}>
              {new Date(dayStart * 1000).toLocaleDateString()}
            </Text>
            <Text size="xs">{dayPercent === -1 ? t('No Data') : `${dayPercent.toFixed(2)}%`}</Text>
            {dayDownTime > 0 && (
              <Text size="xs" c="red.2" fw={700}>
                {t('Down for', {
                  duration: moment.preciseDiff(moment(0), moment(dayDownTime * 1000)),
                })}
              </Text>
            )}
          </Stack>
        }
        position="top"
        withArrow
        transitionProps={{ transition: 'pop', duration: 200 }}
      >
        <div
          className={`w-1.5 h-6 rounded-sm ${barColor} hover:opacity-80 transition-opacity cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation()
            window.location.hash = `#${monitor.id}`
          }}
        />
      </Tooltip>
    )
  }

  // Format latency time ago
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    return `${hours}h`
  }

  // Last update time (mocked for now based on state.lastUpdate or specific monitor usage)
  const timeInfo = state.lastUpdate ? formatTimeAgo(state.lastUpdate) : 'now'

  const totalPercent =
    totalMonitorTime > 0
      ? (((totalMonitorTime - totalDownTime) / totalMonitorTime) * 100).toFixed(2)
      : '0.00'

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-md shadow-slate-200 hover:shadow-xl hover:shadow-slate-200/50 dark:shadow-none dark:hover:shadow-none transition-all duration-300 border border-slate-200 dark:border-zinc-800 overflow-hidden">
      {/* Preview Image Area */}
      <div className="w-full aspect-video max-h-40 p-5 bg-white dark:bg-zinc-800 overflow-hidden">
        <div className="relative w-full h-full overflow-hidden rounded-lg dark:bg-zinc-800">
          {monitor.preview ? (
            <Image
              src={monitor.preview}
              alt={monitor.name}
              fill
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-slate-200 dark:text-zinc-700">
              <IconCloud size={64} stroke={1} className="mt-10" />
            </div>
          )}
        </div>

        {/* Status Badge - Overlay on Image */}
        <div className="absolute top-3 right-3">
          <div
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-md shadow-sm border border-white/10
              ${status === 'up' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}
            `}
          >
            <div className={`w-2 h-2 rounded-full bg-white animate-pulse`} />
            {status === 'up' ? t('Operational') : t('Down')}
          </div>
        </div>

        {/* Header Info - Overlay on Image (Top Left) */}
        <div className="absolute top-3 left-3 max-w-[calc(100%-140px)] rounded-xl overflow-hidden">
          <a
            href={monitor.statusPageLink}
            target="_blank"
            className="flex flex-col cursor-pointer hover:text-emerald-500"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="w-fit font-bold text-sm leading-tight px-2 py-1 backdrop-blur-[2px] rounded-tr-xl bg-white/60">
              {monitor.name}
            </h3>
            {monitor.target && (
              <div className="text-[10px] font-mono text-gray-700 px-2 py-0.5 backdrop-blur-[2px] rounded-r-full bg-white/60 w-fit">
                {new URL(monitor.target).hostname}
              </div>
            )}
          </a>
        </div>
      </div>
      {/* Content Area */}
      <div className="p-5 pt-0 flex flex-col flex-1 gap-4">
        {/* Uptime Bars */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>30d check</span>
            <span>{totalPercent}% uptime</span>
          </div>
          <div className="flex items-end justify-between gap-[3px] h-8 opacity-80">
            {uptimeBars}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800/50">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{t('check_label', { defaultValue: 'Checked' })}</span>
            <span className="text-slate-500">{timeInfo} ago</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-zinc-800 px-2 py-1 rounded-md">
            <span
              className={`font-bold font-mono ${
                lastLatency && lastLatency > 500
                  ? 'text-amber-500'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {lastLatency ? `${lastLatency}ms` : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
