import Head from 'next/head'

import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { MonitorTarget } from '@/types/config'
import { maintenances, pageConfig, workerConfig } from '@/uptime.config'
import OverallStatus from '@/components/OverallStatus'
import MonitorList from '@/components/MonitorList'
import { Center, Container, Text } from '@mantine/core'
import MonitorDetail from '@/components/MonitorDetail'
import Footer from '@/components/Footer'
import { useTranslation } from 'react-i18next'
import { CompactedMonitorStateWrapper, getFromStore } from '@/worker/src/store'

export const runtime = 'experimental-edge'
const inter = Inter({ subsets: ['latin'] })

export default function Home({
  compactedStateStr,
  monitors,
}: {
  compactedStateStr: string
  monitors: MonitorTarget[]
  tooltip?: string
  statusPageLink?: string
}) {
  const { t } = useTranslation('common')
  const [state, setState] = useState(() =>
    new CompactedMonitorStateWrapper(compactedStateStr).uncompact()
  )

  useEffect(() => {
    // Polling for status updates every 180 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/status')
        const data = (await res.json()) as { compactedStateStr: string }
        if (data.compactedStateStr) {
          const newState = new CompactedMonitorStateWrapper(data.compactedStateStr).uncompact()
          setState(newState)
        }
      } catch (error) {
        console.error('Failed to update status:', error)
      }
    }, 180 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Specify monitorId in URL hash to view a specific monitor (can be used in iframe)
  const monitorId = window.location.hash.substring(1)
  if (monitorId) {
    const monitor = monitors.find((monitor) => monitor.id === monitorId)
    if (!monitor || !state) {
      return <Text fw={700}>{t('Monitor not found', { id: monitorId })}</Text>
    }
    return (
      <div style={{ maxWidth: '810px' }}>
        <MonitorDetail monitor={monitor} state={state} />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageConfig.title}</title>
        <link rel="icon" href={pageConfig.favicon ?? '/logo.png'} />
      </Head>

      <main className={`${inter.className} min-h-screen bg-gray-50`}>
        <div className="max-w-7xl mx-auto px-4">
          {state.lastUpdate === 0 ? (
            <Center>
              <Text fw={700}>{t('Monitor State not defined')}</Text>
            </Center>
          ) : (
            <>
              <OverallStatus state={state} monitors={monitors} maintenances={maintenances} />
              <MonitorList monitors={monitors} state={state} />
            </>
          )}
        </div>

        <Footer />
      </main>
    </>
  )
}

export async function getServerSideProps() {
  // Read state as string from storage, to avoid hitting server-side cpu time limit
  const compactedStateStr = await getFromStore(process.env as any, 'state')

  // Only present these values to client
  const monitors = workerConfig.monitors.map((monitor) => {
    return {
      id: monitor.id,
      name: monitor.name,
      // @ts-ignore
      tooltip: monitor?.tooltip ?? null,
      // @ts-ignore
      statusPageLink: monitor?.statusPageLink ?? null,
      // @ts-ignore
      hideLatencyChart: monitor?.hideLatencyChart ?? null,
      // @ts-ignore
      preview: monitor?.preview ?? null,
      // @ts-ignore
      target: monitor?.target ?? null,
      // @ts-ignore
      group: monitor?.group ?? null,
    }
  })

  return { props: { compactedStateStr, monitors } }
}
