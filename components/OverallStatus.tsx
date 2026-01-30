import { MaintenanceConfig, MonitorTarget } from '@/types/config'
import { Collapse } from '@mantine/core'
import { IconCheck, IconX, IconAlertCircle, IconActivity } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import MaintenanceAlert from './MaintenanceAlert'
import { pageConfig } from '@/uptime.config'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

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
  let heroText = 'UNKNOWN STATUS'

  if (state.overallUp === 0 && state.overallDown === 0) {
    statusString = t('No data yet')
    statusColor = 'text-gray-400'
    heroText = 'NO DATA'
  } else if (state.overallUp === 0) {
    statusString = t('All systems not operational')
    statusColor = 'text-red-500'
    StatusIcon = IconX
    heroText = 'SYSTEM OUTAGE'
  } else if (state.overallDown === 0) {
    statusString = t('All systems operational')
    statusColor = 'text-emerald-500'
    StatusIcon = IconCheck
    heroText = 'ALL SYSTEMS GO'
  } else {
    statusString = t('Some systems not operational', {
      down: state.overallDown,
      total: state.overallUp + state.overallDown,
    })
    statusColor = 'text-yellow-500'
    heroText = 'PARTIAL OUTAGE'
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
    <div className="py-16 text-center">
      <div className="flex justify-center items-center gap-4 mb-4">
        <Image
          src="/logo.png"
          className="w-8 h-8 md:w-14 md:h-14 group-hover:scale-105 transition-transform"
          alt="Logo"
          width={64}
          height={64}
        />
        <h1 className="text-2xl md:text-4xl font-black tracking-tight dark:text-white bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
          WeizWz Services Status
        </h1>
      </div>
      <div className={`flex items-center justify-center gap-2 text-xl font-medium ${statusColor}`}>
        <StatusIcon stroke={3} size={28} />
        <span>{statusString}</span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-400">
        <IconActivity size={14} />
        <span>
          {t('Last updated: {{time}}', {
            time: new Date(state.lastUpdate * 1000).toLocaleString(),
          })}
        </span>
      </div>

      {/* Upcoming Maintenance */}
      {upcomingMaintenances.length > 0 && (
        <div className="max-w-3xl mx-auto mb-8">
          <div
            className="text-gray-500 mb-2 cursor-pointer hover:underline"
            onClick={() => setExpandUpcoming(!expandUpcoming)}
          >
            {t('upcoming maintenance', { count: upcomingMaintenances.length })}{' '}
            <span>{expandUpcoming ? t('Hide') : t('Show')}</span>
          </div>

          <Collapse in={expandUpcoming}>
            {upcomingMaintenances.map((maintenance, idx) => (
              <MaintenanceAlert
                key={`upcoming-${idx}`}
                maintenance={maintenance}
                style={{ marginTop: 10 }}
                upcoming
              />
            ))}
          </Collapse>
        </div>
      )}

      {/* Active Maintenance */}
      <div className="max-w-3xl mx-auto">
        {activeMaintenances.map((maintenance, idx) => (
          <MaintenanceAlert
            key={`active-${idx}`}
            maintenance={maintenance}
            style={{ marginTop: 10 }}
          />
        ))}
      </div>
    </div>
  )
}
