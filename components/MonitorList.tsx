import { MonitorTarget, MonitorState } from '@/types/config'
import { IconServer, IconApps, IconDeviceDesktop, IconCloud } from '@tabler/icons-react'
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

  // Helper to get icon for group
  const getGroupIcon = (groupName: string) => {
    if (groupName.includes('AI')) return IconCloud
    if (groupName.includes('工具')) return IconApps
    return IconDeviceDesktop
  }

  return (
    <div className="space-y-16">
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
