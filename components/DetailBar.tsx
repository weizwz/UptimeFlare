import { MonitorState, MonitorTarget } from '@/types/config'
import { getColor } from '@/util/color'
import { Box, Tooltip, Modal, Stack, Text, Alert } from '@mantine/core'
import { useResizeObserver } from '@mantine/hooks'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
const moment = require('moment')
require('moment-precise-range-plugin')

export default function DetailBar({
  monitor,
  state,
}: {
  monitor: MonitorTarget
  state: MonitorState
}) {
  const { t } = useTranslation('common')
  const [barRef, barRect] = useResizeObserver()
  const [modalOpened, setModalOpened] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modelContent, setModelContent] = useState(<div />)

  const overlapLen = (x1: number, x2: number, y1: number, y2: number) => {
    return Math.max(0, Math.min(x2, y2) - Math.max(x1, y1))
  }

  const formatDuration = (seconds: number) => {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    const parts = []
    if (d > 0) parts.push(`${d}d`)
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}m`)
    if (s > 0) parts.push(`${s}s`)
    return parts.join(' ') || '0s'
  }

  const uptimePercentBars = []

  const currentTime = Math.round(Date.now() / 1000)
  const montiorStartTime = state.incident[monitor.id][0].start[0]

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  for (let i = 89; i >= 0; i--) {
    const dayStart = Math.round(todayStart.getTime() / 1000) - i * 86400
    const dayEnd = dayStart + 86400

    const dayMonitorTime = overlapLen(dayStart, dayEnd, montiorStartTime, currentTime)
    let dayDownTime = 0

    let incidentReasons: { start: string; end: string; error: string }[] = []

    for (let incident of state.incident[monitor.id]) {
      const incidentStart = incident.start[0]
      const incidentEnd = incident.end ?? currentTime

      const overlap = overlapLen(dayStart, dayEnd, incidentStart, incidentEnd)
      dayDownTime += overlap

      // Incident history for the day
      if (overlap > 0) {
        for (let i = 0; i < incident.error.length; i++) {
          let partStart = incident.start[i]
          let partEnd =
            i === incident.error.length - 1 ? incident.end ?? currentTime : incident.start[i + 1]
          partStart = Math.max(partStart, dayStart)
          partEnd = Math.min(partEnd, dayEnd)

          if (overlapLen(dayStart, dayEnd, partStart, partEnd) > 0) {
            const startStr = new Date(partStart * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            const endStr = new Date(partEnd * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            incidentReasons.push({
              start: startStr,
              end: endStr,
              error: incident.error[i],
            })
          }
        }
      }
    }

    const dayPercent = (((dayMonitorTime - dayDownTime) / dayMonitorTime) * 100).toPrecision(4)

    uptimePercentBars.push(
      <Tooltip
        multiline
        key={i}
        position="top"
        withArrow
        transitionProps={{ transition: 'pop-bottom-left' }}
        label={
          Number.isNaN(Number(dayPercent)) ? (
            t('No Data')
          ) : (
            <Stack gap={2} p={4}>
              <Text size="xs" fw={700}>
                {new Date(dayStart * 1000).toLocaleDateString()}
              </Text>
              <Text size="xs">
                {t('percent at date', { percent: dayPercent, date: '' }).replace('  ', ' ')}
              </Text>
              {dayDownTime > 0 && (
                <Text size="xs" c="red.3">
                  {t('Down for', {
                    duration: formatDuration(dayDownTime),
                  })}
                </Text>
              )}
            </Stack>
          )
        }
      >
        <div
          style={{
            height: '32px',
            flex: 1,
            background: getColor(dayPercent, false),
            borderRadius: '4px',
            margin: '0 1px',
            opacity: 0.8,
            transition: 'all 0.2s ease',
            cursor: dayDownTime > 0 ? 'pointer' : 'default',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'scaleY(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.8'
            e.currentTarget.style.transform = 'scaleY(1)'
          }}
          onClick={() => {
            if (dayDownTime > 0) {
              setModalTitle(
                t('incidents at', {
                  name: monitor.name,
                  date: new Date(dayStart * 1000).toLocaleDateString(),
                })
              )
              setModelContent(
                <div className="flex flex-col gap-3">
                  <div className="text-sm text-slate-500 mb-2">
                    {t('Total downtime')}:{' '}
                    <span className="font-semibold text-rose-500">
                      {formatDuration(dayDownTime)}
                    </span>
                  </div>
                  {incidentReasons.map((reason, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                          {reason.start} - {reason.end}
                        </div>
                      </div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-mono break-all">
                        {reason.error}
                      </div>
                    </div>
                  ))}
                </div>
              )
              setModalOpened(true)
            }
          }}
        />
      </Tooltip>
    )
  }

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={modalTitle}
        size={'40em'}
      >
        {modelContent}
      </Modal>
      <Box
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          marginTop: '10px',
          marginBottom: '5px',
        }}
        visibleFrom="540"
        ref={barRef}
      >
        {uptimePercentBars.slice(Math.floor(Math.max(9 * 90 - barRect.width, 0) / 9), 90)}
      </Box>
    </>
  )
}
