import { MaintenanceConfig, MonitorTarget } from '@/types/config'
import {
  Container,
  Title,
  Collapse,
  Card,
  Stack,
  ThemeIcon,
  Text,
  Group,
  RingProgress,
  Center,
  Box,
} from '@mantine/core'
import { IconCheck, IconX, IconAlertCircle, IconActivity } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import MaintenanceAlert from './MaintenanceAlert'
import { pageConfig } from '@/uptime.config'
import { useTranslation } from 'react-i18next'

function useWindowVisibility() {
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
  return isVisible
}

export default function OverallStatus({
  state,
  maintenances,
  monitors,
}: {
  state: { overallUp: number; overallDown: number; lastUpdate: number }
  maintenances: MaintenanceConfig[]
  monitors: MonitorTarget[]
}) {
  const { t } = useTranslation('common')
  let group = pageConfig.group
  let groupedMonitor = (group && Object.keys(group).length > 0) || false

  let statusString = ''
  let statusColor = 'gray'
  let StatusIcon = IconAlertCircle

  if (state.overallUp === 0 && state.overallDown === 0) {
    statusString = t('No data yet')
    statusColor = 'gray'
  } else if (state.overallUp === 0) {
    statusString = t('All systems not operational')
    statusColor = 'red'
    StatusIcon = IconX
  } else if (state.overallDown === 0) {
    statusString = t('All systems operational')
    statusColor = 'teal'
    StatusIcon = IconCheck
  } else {
    statusString = t('Some systems not operational', {
      down: state.overallDown,
      total: state.overallUp + state.overallDown,
    })
    statusColor = 'yellow'
  }

  const [openTime] = useState(Math.round(Date.now() / 1000))
  const [currentTime, setCurrentTime] = useState(Math.round(Date.now() / 1000))
  const isWindowVisible = useWindowVisibility()
  const [expandUpcoming, setExpandUpcoming] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isWindowVisible) return
      if (currentTime - state.lastUpdate > 300 && currentTime - openTime > 30) {
        window.location.reload()
      }
      setCurrentTime(Math.round(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  })

  const now = new Date()

  const activeMaintenances: (Omit<MaintenanceConfig, 'monitors'> & {
    monitors?: MonitorTarget[]
  })[] = maintenances
    .filter((m) => now >= new Date(m.start) && (!m.end || now <= new Date(m.end)))
    .map((maintenance) => ({
      ...maintenance,
      monitors: maintenance.monitors?.map(
        (monitorId) => monitors.find((mon) => monitorId === mon.id)!
      ),
    }))

  const upcomingMaintenances: (Omit<MaintenanceConfig, 'monitors'> & {
    monitors?: (MonitorTarget | undefined)[]
  })[] = maintenances
    .filter((m) => now < new Date(m.start))
    .map((maintenance) => ({
      ...maintenance,
      monitors: maintenance.monitors?.map(
        (monitorId) => monitors.find((mon) => monitorId === mon.id)!
      ),
    }))

  return (
    <Container size="md" mt="xl">
      <Card
        padding="xl"
        radius="lg"
        withBorder
        style={{
          overflow: 'visible',
          background: `linear-gradient(145deg, var(--mantine-color-body), var(--mantine-color-${statusColor}-light))`,
        }}
      >
        <Group justify="space-between" align="center">
          <Group>
            <ThemeIcon
              color={statusColor}
              size={60}
              radius="xl"
              variant="light"
              style={{ boxShadow: `0 0 20px var(--mantine-color-${statusColor}-3)` }}
            >
              <StatusIcon size={36} stroke={2} />
            </ThemeIcon>

            <Stack gap={4}>
              <Title order={2} style={{ fontWeight: 800 }}>
                {statusString}
              </Title>
              <Group gap={6}>
                <IconActivity size={16} style={{ opacity: 0.5 }} />
                <Text c="dimmed" size="sm">
                  {t('Last updated: {{time}}', {
                    time: new Date(state.lastUpdate * 1000).toLocaleString(),
                  })}
                </Text>
              </Group>
            </Stack>
          </Group>

          <Box visibleFrom="sm">
            <RingProgress
              size={80}
              thickness={8}
              roundCaps
              sections={[{ value: 100, color: statusColor }]}
              label={
                <Center>
                  <ThemeIcon color={statusColor} variant="transparent" radius="xl">
                    <StatusIcon size={24} />
                  </ThemeIcon>
                </Center>
              }
            />
          </Box>
        </Group>
      </Card>

      {/* Upcoming Maintenance */}
      {upcomingMaintenances.length > 0 && (
        <>
          <Title mt="lg" style={{ textAlign: 'center', color: '#70778c' }} order={5}>
            {t('upcoming maintenance', { count: upcomingMaintenances.length })}{' '}
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setExpandUpcoming(!expandUpcoming)}
            >
              {expandUpcoming ? t('Hide') : t('Show')}
            </span>
          </Title>

          <Collapse in={expandUpcoming}>
            {upcomingMaintenances.map((maintenance, idx) => (
              <MaintenanceAlert
                key={`upcoming-${idx}`}
                maintenance={maintenance}
                style={{ maxWidth: groupedMonitor ? '897px' : '865px' }}
                upcoming
              />
            ))}
          </Collapse>
        </>
      )}

      {/* Active Maintenance */}
      {activeMaintenances.map((maintenance, idx) => (
        <MaintenanceAlert
          key={`active-${idx}`}
          maintenance={maintenance}
          style={{ maxWidth: groupedMonitor ? '897px' : '865px' }}
        />
      ))}
    </Container>
  )
}
