import { Alert, List, Text, useMantineTheme, ThemeIcon, Group, Stack, Badge } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconAlertTriangle, IconCalendar, IconClock } from '@tabler/icons-react'
import { MaintenanceConfig, MonitorTarget } from '@/types/config'
import { pageConfig } from '@/uptime.config'
import { useTranslation } from 'react-i18next'

export default function MaintenanceAlert({
  maintenance,
  style,
  upcoming = false,
}: {
  maintenance: Omit<MaintenanceConfig, 'monitors'> & { monitors?: (MonitorTarget | undefined)[] }
  style?: React.CSSProperties
  upcoming?: boolean
}) {
  const { t } = useTranslation('common')
  const theme = useMantineTheme()
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`)

  const color = upcoming
    ? pageConfig.maintenances?.upcomingColor ?? 'gray'
    : maintenance.color || 'yellow'

  return (
    <Alert
      variant="light"
      color={color}
      title={
        <Group gap="xs" align="center">
          <ThemeIcon color={color} variant="light" radius="md">
            <IconAlertTriangle size={18} />
          </ThemeIcon>
          <Text fw={700} size="lg">
            {(upcoming ? t('Upcoming') : '') + (maintenance.title || t('Scheduled Maintenance'))}
          </Text>
        </Group>
      }
      withCloseButton={false}
      style={{ margin: '16px auto 0 auto', borderRadius: 'var(--mantine-radius-lg)', ...style }}
    >
      <Stack gap="md" mt="xs">
        <Group gap="xl" wrap="wrap">
          <Group gap="xs">
            <IconCalendar size={16} style={{ opacity: 0.7 }} />
            <Text size="sm" fw={500}>
              {upcoming ? t('Scheduled for') : t('From')}:{' '}
              {new Date(maintenance.start).toLocaleString()}
            </Text>
          </Group>
          <Group gap="xs">
            <IconClock size={16} style={{ opacity: 0.7 }} />
            <Text size="sm" fw={500}>
              {upcoming ? t('Expected end') : t('To')}:{' '}
              {maintenance.end
                ? new Date(maintenance.end).toLocaleString()
                : t('Until further notice')}
            </Text>
          </Group>
        </Group>

        <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
          {maintenance.body}
        </Text>

        {maintenance.monitors && maintenance.monitors.length > 0 && (
          <Stack gap="xs">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              {t('Affected components')}
            </Text>
            <Group gap="xs">
              {maintenance.monitors.map((comp, compIdx) => (
                <Badge key={compIdx} variant="dot" color={color}>
                  {comp?.name ?? t('MONITOR ID NOT FOUND')}
                </Badge>
              ))}
            </Group>
          </Stack>
        )}
      </Stack>
    </Alert>
  )
}
