import { MonitorTarget, MonitorState } from '@/types/config'
import { IconServer, IconApps, IconDeviceDesktop, IconCloud } from '@tabler/icons-react'
import MonitorCard from './MonitorCard'

import { pageConfig } from '@/uptime.config'

export default function MonitorList({
  monitors,
  state,
}: {
  monitors: MonitorTarget[]
  state: MonitorState
}) {
  // Use pageConfig.group to group monitors
  // If a monitor is not in any group, it will be put into 'Ungrouped'
  const monitorMap = new Map(monitors.map((m) => [m.id, m]))
  const processedIds = new Set<string>()

  const sortedGroups: string[] = []
  const groupedMonitors: Record<string, MonitorTarget[]> = {}

  if (pageConfig.group) {
    for (const [groupName, monitorIds] of Object.entries(pageConfig.group)) {
      sortedGroups.push(groupName)
      groupedMonitors[groupName] = []
      monitorIds.forEach((id) => {
        const monitor = monitorMap.get(id)
        if (monitor) {
          groupedMonitors[groupName].push(monitor)
          processedIds.add(id)
        }
      })
    }
  }

  // Handle monitors not in any group
  const ungroupedMonitors = monitors.filter((m) => !processedIds.has(m.id))
  if (ungroupedMonitors.length > 0) {
    sortedGroups.push('Ungrouped')
    groupedMonitors['Ungrouped'] = ungroupedMonitors
  }

  // Helper to get icon for group
  const getGroupIcon = (groupName: string) => {
    if (groupName.includes('AI')) return IconCloud
    if (groupName.includes('工具')) return IconApps
    return IconDeviceDesktop
  }

  return (
    <div className="space-y-8">
      {sortedGroups.map((group) => {
        const GroupIcon = getGroupIcon(group)
        return (
          <div key={group}>
            {group !== 'Ungrouped' && (
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <GroupIcon className="text-emerald-500 opacity-80" size={24} />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{group}</h2>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedMonitors[group].map((monitor) => (
                <MonitorCard key={monitor.id} monitor={monitor} state={state} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
