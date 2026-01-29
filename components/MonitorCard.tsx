import {
  Card,
  Group,
  Text,
  Badge,
  Tooltip,
  ThemeIcon,
  RingProgress,
  Center,
  Stack,
  Box,
} from '@mantine/core'
import { MonitorTarget, MonitorState } from '@/types/config'
import { useTranslation } from 'react-i18next'
import { IconCheck, IconX, IconActivity, IconServer } from '@tabler/icons-react'

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
  const montiorStartTime = state.incident[monitor.id][0].start[0]
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  // Helper to calculate overlap
  const overlapLen = (x1: number, x2: number, y1: number, y2: number) => {
    return Math.max(0, Math.min(x2, y2) - Math.max(x1, y1))
  }

  for (let i = 29; i >= 0; i--) {
    const dayStart = Math.round(todayStart.getTime() / 1000) - i * 86400
    const dayEnd = dayStart + 86400
    const dayMonitorTime = overlapLen(dayStart, dayEnd, montiorStartTime, currentTime)
    let dayDownTime = 0

    for (let incident of state.incident[monitor.id]) {
      const incidentStart = incident.start[0]
      const incidentEnd = incident.end ?? currentTime
      const overlap = overlapLen(dayStart, dayEnd, incidentStart, incidentEnd)
      dayDownTime += overlap
    }

    const dayPercent =
      dayMonitorTime === 0 ? -1 : ((dayMonitorTime - dayDownTime) / dayMonitorTime) * 100

    // Determine color based on uptime
    let barColor = 'var(--mantine-color-gray-3)' // No data
    if (dayPercent === 100) barColor = 'var(--mantine-color-teal-5)'
    else if (dayPercent >= 98) barColor = 'var(--mantine-color-teal-3)'
    else if (dayPercent >= 95) barColor = 'var(--mantine-color-yellow-5)'
    else if (dayPercent >= 0) barColor = 'var(--mantine-color-red-5)'

    uptimeBars.push(
      <Tooltip
        key={i}
        label={
          dayPercent === -1
            ? t('No Data')
            : `${new Date(dayStart * 1000).toLocaleDateString()}: ${dayPercent.toFixed(2)}%`
        }
        position="top"
        withArrow
        transitionProps={{ transition: 'pop-bottom-left' }}
      >
        <Box
          style={{
            width: 6,
            height: 24,
            backgroundColor: barColor,
            borderRadius: 4,
            opacity: 0.8,
            transition: 'opacity 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
        />
      </Tooltip>
    )
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)'
      }}
      onClick={() => (window.location.href = monitor.statusPageLink || '#')}
    >
      <Group justify="space-between" mb="md" align="flex-start">
        <Group gap="sm">
          <ThemeIcon variant="light" size="lg" color={status === 'up' ? 'teal' : 'red'} radius="md">
            {status === 'up' ? <IconCheck size={20} /> : <IconX size={20} />}
          </ThemeIcon>
          <div>
            <Text fw={700} size="lg" lh={1.2}>
              {monitor.name}
            </Text>
            <Text size="xs" c="dimmed" mt={2}>
              {monitor.target}
            </Text>
          </div>
        </Group>

        <Badge color={status === 'up' ? 'teal' : 'red'} variant="dot" size="lg" radius="md">
          {status === 'up' ? t('Operational') : t('Down')}
        </Badge>
      </Group>

      <Group gap={4} mt="lg" justify="space-between" align="flex-end">
        <Group gap={2} style={{ flex: 1 }}>
          {uptimeBars}
        </Group>

        <Stack gap={0} align="flex-end">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">
            {t('Response')}
          </Text>
          <Group gap={4} align="center">
            <IconActivity size={14} style={{ opacity: 0.5 }} />
            <Text fw={700} size="sm" c={lastLatency && lastLatency > 500 ? 'yellow' : 'dimmed'}>
              {lastLatency ? `${lastLatency}ms` : '-'}
            </Text>
          </Group>
        </Stack>
      </Group>
    </Card>
  )
}
