import '@mantine/core/styles.css'
import type { AppProps } from 'next/app'
import { MantineProvider, createTheme } from '@mantine/core'
import NoSsr from '@/components/NoSsr'
import '@/util/i18n'

const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '800',
  },
  components: {
    Card: {
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
    },
    Button: {
      defaultProps: {
        fw: 600,
      },
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSsr>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <Component {...pageProps} />
      </MantineProvider>
    </NoSsr>
  )
}
