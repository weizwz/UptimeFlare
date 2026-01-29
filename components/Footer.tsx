import { Container, Group, Text, Anchor, Stack, Divider } from '@mantine/core'
import { pageConfig } from '@/uptime.config'

export default function Footer() {
  const links = pageConfig.links || []

  return (
    <footer style={{ marginTop: 'auto' }}>
      <Container size="lg" py="xl">
        <Divider mb="xl" opacity={0.5} />

        <Stack align="center" gap="md">
          {/* Navigation Links */}
          {links.length > 0 && (
            <Group gap="lg">
              {links.map((link, index) => (
                <Anchor
                  key={index}
                  href={link.link}
                  target="_blank"
                  c="dimmed"
                  size="sm"
                  fw={500}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--mantine-color-blue-6)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'var(--mantine-color-dimmed)')
                  }
                >
                  {link.label}
                </Anchor>
              ))}
            </Group>
          )}

          {/* Copyright & Powered By */}
          <Stack gap={4} align="center">
            <Text c="dimmed" size="xs">
              &copy; {new Date().getFullYear()} {pageConfig.title || 'UptimeFlare'}
            </Text>
            <Group gap={4} c="dimmed" style={{ fontSize: '10px' }}>
              <Text c="dimmed" size="xs">
                本站使用
              </Text>
              <Anchor
                href="https://github.com/lyc8503/UptimeFlare"
                target="_blank"
                c="dimmed"
                size="xs"
                fw={700}
              >
                UptimeFlare
              </Anchor>
            </Group>
          </Stack>
        </Stack>
      </Container>
    </footer>
  )
}
