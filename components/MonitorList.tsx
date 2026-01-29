import { MonitorTarget, MonitorState } from '@/types/config'
import { SimpleGrid, Title, Stack, Divider, Text, Group, ThemeIcon } from '@mantine/core'
import { IconServer } from '@tabler/icons-react'
import MonitorCard from './MonitorCard'

export default function MonitorList({
  monitors,
  state,
}: {
  monitors: MonitorTarget[]
  state: MonitorState
}) {
  // Group monitors
  const groupedMonitors = monitors.reduce(
    (acc, monitor) => {
      const group = monitor.group || 'Ungrouped'
      if (!acc[group]) acc[group] = []
      acc[group].push(monitor)
      return acc
    },
    {} as Record<string, MonitorTarget[]>
  )

  // Sort groups: "Ungrouped" last, others alphabetical or custom order if needed
  const sortedGroups = Object.keys(groupedMonitors).sort((a, b) => {
    if (a === 'Ungrouped') return 1
    if (b === 'Ungrouped') return -1
    return a.localeCompare(b)
  })

  return (
    <Stack gap={40} mt={40}>
      {sortedGroups.map((group) => (
        <div key={group}>
          {group !== 'Ungrouped' && (
            <Group mb="lg" align="center">
              <ThemeIcon variant="light" size="lg" radius="md" color="blue">
                <IconServer size={20} />
              </ThemeIcon>
              <Title order={3} size="h3" fw={800} style={{ letterSpacing: '-0.5px' }}>
                {group}
              </Title>
              <Divider style={{ flex: 1 }} />
            </Group>
          )}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" verticalSpacing="lg">
            {groupedMonitors[group].map((monitor) => (
              <MonitorCard key={monitor.id} monitor={monitor} state={state} />
            ))}
          </SimpleGrid>
        </div>
      ))}
    </Stack>
  )
}
