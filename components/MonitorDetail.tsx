import { Text, Tooltip, Card, Group, Badge, ThemeIcon, Stack, Box } from '@mantine/core'
import { MonitorState, MonitorTarget } from '@/types/config'
import { IconAlertTriangle, IconCheck, IconX, IconExternalLink } from '@tabler/icons-react'
import DetailChart from './DetailChart'
import DetailBar from './DetailBar'
import { maintenances } from '@/uptime.config'
import { useTranslation } from 'react-i18next'

export default function MonitorDetail({
  monitor,
  state,
}: {
  monitor: MonitorTarget
  state: MonitorState
}) {
  const { t } = useTranslation('common')

  if (!state.latency[monitor.id])
    return (
      <Card padding="lg" radius="md" withBorder>
        <Text fw={700} size="lg">
          {monitor.name}
        </Text>
        <Text c="dimmed" mt="sm">
          {t('No data available')}
        </Text>
      </Card>
    )

  const lastIncident = state.incident[monitor.id].slice(-1)[0]
  const isUp = lastIncident.end !== undefined

  // Hide real status icon if monitor is in maintenance
  const now = new Date()
  const hasMaintenance = maintenances
    .filter((m) => now >= new Date(m.start) && (!m.end || now <= new Date(m.end)))
    .find((maintenance) => maintenance.monitors?.includes(monitor.id))

  let StatusIcon = isUp ? IconCheck : IconX
  let statusColor = isUp ? 'teal' : 'red'
  let statusText = isUp ? t('Operational') : t('Down')

  if (hasMaintenance) {
    StatusIcon = IconAlertTriangle
    statusColor = 'yellow'
    statusText = t('Maintenance')
  }

  let totalTime = Date.now() / 1000 - state.incident[monitor.id][0].start[0]
  let downTime = 0
  for (let incident of state.incident[monitor.id]) {
    downTime += (incident.end ?? Date.now() / 1000) - incident.start[0]
  }

  const uptimePercent = (((totalTime - downTime) / totalTime) * 100).toPrecision(4)

  return (
    <Card padding="xl" radius="lg" withBorder shadow="sm">
      <Group justify="space-between" mb="xl">
        <Group>
          <ThemeIcon size={42} radius="md" color={statusColor} variant="light">
            <StatusIcon size={24} />
          </ThemeIcon>
          <div>
            <Group gap={6}>
              <Text fw={800} size="xl" lh={1.2}>
                {monitor.name}
              </Text>
              {monitor.statusPageLink && (
                <Tooltip label={t('Visit Link')}>
                  <ThemeIcon
                    variant="transparent"
                    color="gray"
                    size="sm"
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.open(monitor.statusPageLink, '_blank')}
                  >
                    <IconExternalLink size={16} />
                  </ThemeIcon>
                </Tooltip>
              )}
            </Group>
            {monitor.tooltip && (
              <Text size="sm" c="dimmed" mt={2}>
                {monitor.tooltip}
              </Text>
            )}
          </div>
        </Group>

        <Badge
          size="xl"
          radius="md"
          variant="light"
          color={statusColor}
          style={{ textTransform: 'none' }}
        >
          {statusText} • {t('Overall', { percent: uptimePercent })}
        </Badge>
      </Group>

      <Stack gap="lg">
        <Box>
          <Text size="sm" fw={700} c="dimmed" mb="xs" tt="uppercase">
            {t('Uptime History')}
          </Text>
          <DetailBar monitor={monitor} state={state} />
        </Box>

        {!monitor.hideLatencyChart && (
          <Box>
            <Text size="sm" fw={700} c="dimmed" mb="xs" tt="uppercase">
              {t('Response Time')}
            </Text>
            <DetailChart monitor={monitor} state={state} />
          </Box>
        )}
      </Stack>
    </Card>
  )
}
