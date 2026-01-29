import { Container, Group, Image, Text, Burger, Drawer, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from '@/styles/Header.module.css'
import { pageConfig } from '@/uptime.config'
import { PageConfigLink } from '@/types/config'
import { useTranslation } from 'react-i18next'

export default function Header({ style }: { style?: React.CSSProperties }) {
  const { t } = useTranslation('common')
  const [opened, { toggle }] = useDisclosure(false)
  const linkToElement = (link: PageConfigLink, i: number) => {
    return (
      <a
        key={i}
        href={link.link}
        target={link.link.startsWith('/') ? undefined : '_blank'}
        className={classes.link}
        data-active={link.highlight}
      >
        {link.label}
      </a>
    )
  }

  const links = [{ label: t('Incidents'), link: '/incidents' }, ...(pageConfig.links || [])]
  const items = links?.map(linkToElement)

  return (
    <header className={classes.header} style={style}>
      <Container size="lg" className={classes.inner}>
        <Group gap={10} style={{ cursor: 'pointer' }} onClick={() => (window.location.href = '/')}>
          <Image src="/logo.svg" className={classes.logo} alt="Logo" />
          <Text fw={700} size="xl" c="dimmed">
            WeizStatus
          </Text>
        </Group>

        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

        <Drawer
          opened={opened}
          onClose={toggle}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="xs"
          zIndex={1000000}
        >
          <Stack>{items}</Stack>
        </Drawer>
      </Container>
    </header>
  )
}
