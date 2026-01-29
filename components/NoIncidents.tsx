import { Alert, Text, Group, ThemeIcon } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export default function NoIncidentsAlert({ style }: { style?: React.CSSProperties }) {
  const { t } = useTranslation('common')
  return (
    <Alert
      variant="light"
      color="teal"
      title={
        <Group gap="xs" align="center">
          <ThemeIcon color="teal" variant="light" radius="md">
            <IconCircleCheck size={18} />
          </ThemeIcon>
          <Text fw={700} size="lg">
            {t('No incidents in this month')}
          </Text>
        </Group>
      }
      withCloseButton={false}
      style={{
        margin: '16px auto 0 auto',
        borderRadius: 'var(--mantine-radius-lg)',
        ...style,
      }}
    >
      <Text size="sm" mt="xs" c="dimmed">
        {t('There are no incidents for this month')}
      </Text>
    </Alert>
  )
}
