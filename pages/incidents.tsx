import Head from 'next/head'
import { Inter } from 'next/font/google'
import { MaintenanceConfig, MonitorTarget } from '@/types/config'
import { maintenances, pageConfig, workerConfig } from '@/uptime.config'
import { Button, Container, Group, Select, Title, Stack, Card, Text } from '@mantine/core'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import MaintenanceAlert from '@/components/MaintenanceAlert'
import NoIncidentsAlert from '@/components/NoIncidents'
import { useTranslation } from 'react-i18next'
import { IconChevronLeft, IconChevronRight, IconCalendar, IconFilter } from '@tabler/icons-react'

export const runtime = 'experimental-edge'
const inter = Inter({ subsets: ['latin'] })

function getSelectedMonth() {
  const hash = window.location.hash.replace('#', '')
  if (!hash) {
    const now = new Date()
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
  }
  return hash.split('-').splice(0, 2).join('-')
}

function filterIncidentsByMonth(
  incidents: MaintenanceConfig[],
  monthStr: string
): (Omit<MaintenanceConfig, 'monitors'> & { monitors: MonitorTarget[] })[] {
  return incidents
    .filter((incident) => {
      const d = new Date(incident.start)
      const incidentMonth = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
      return incidentMonth === monthStr
    })
    .map((e) => ({
      ...e,
      monitors: (e.monitors || []).map((e) => workerConfig.monitors.find((mon) => mon.id === e)!),
    }))
    .sort((a, b) => (new Date(a.start) > new Date(b.start) ? -1 : 1))
}

function getPrevNextMonth(monthStr: string) {
  const [year, month] = monthStr.split('-').map(Number)
  const date = new Date(year, month - 1)
  const prev = new Date(date)
  prev.setMonth(prev.getMonth() - 1)
  const next = new Date(date)
  next.setMonth(next.getMonth() + 1)
  return {
    prev: prev.getFullYear() + '-' + String(prev.getMonth() + 1).padStart(2, '0'),
    next: next.getFullYear() + '-' + String(next.getMonth() + 1).padStart(2, '0'),
  }
}

export default function IncidentsPage() {
  const { t } = useTranslation('common')
  const [selectedMonitor, setSelectedMonitor] = useState<string | null>('')
  const [selectedMonth, setSelectedMonth] = useState(getSelectedMonth())

  useEffect(() => {
    const onHashChange = () => setSelectedMonth(getSelectedMonth())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const filteredIncidents = filterIncidentsByMonth(maintenances, selectedMonth)
  const monitorFilteredIncidents = selectedMonitor
    ? filteredIncidents.filter((i) => i.monitors.find((e) => e.id === selectedMonitor))
    : filteredIncidents

  const { prev, next } = getPrevNextMonth(selectedMonth)

  const monitorOptions = [
    { value: '', label: t('All Monitors') },
    ...workerConfig.monitors.map((monitor) => ({
      value: monitor.id,
      label: monitor.name,
    })),
  ]

  return (
    <>
      <Head>
        <title>
          {t('Incidents')} - {pageConfig.title}
        </title>
        <link rel="icon" href={pageConfig.favicon ?? '/favicon.ico'} type="image/x-icon" />
      </Head>

      <main className={inter.className} style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container size="md" pb="xl" style={{ minHeight: '60vh' }}>
          <Stack gap="lg">
            <Group justify="space-between" align="center">
              <Title order={2} size="h1" fw={800}>
                {t('Incident History')}
              </Title>

              <Select
                placeholder={t('Filter by monitor')}
                data={monitorOptions}
                value={selectedMonitor}
                onChange={setSelectedMonitor}
                clearable
                leftSection={<IconFilter size={16} />}
                style={{ width: 250 }}
                radius="md"
              />
            </Group>

            <Card padding="lg" radius="lg" withBorder>
              <Group justify="space-between" mb="xl">
                <Button
                  variant="subtle"
                  leftSection={<IconChevronLeft size={18} />}
                  onClick={() => (window.location.hash = prev)}
                  color="gray"
                >
                  {t('Previous')}
                </Button>

                <Group gap="xs">
                  <IconCalendar size={20} style={{ opacity: 0.5 }} />
                  <Text fw={700} size="xl">
                    {selectedMonth}
                  </Text>
                </Group>

                <Button
                  variant="subtle"
                  rightSection={<IconChevronRight size={18} />}
                  onClick={() => (window.location.hash = next)}
                  color="gray"
                >
                  {t('Next')}
                </Button>
              </Group>

              <Stack gap="md">
                {monitorFilteredIncidents.length === 0 ? (
                  <NoIncidentsAlert />
                ) : (
                  monitorFilteredIncidents.map((incident, i) => (
                    <MaintenanceAlert key={i} maintenance={incident} />
                  ))
                )}
              </Stack>
            </Card>
          </Stack>
        </Container>

        <Footer />
      </main>
    </>
  )
}
