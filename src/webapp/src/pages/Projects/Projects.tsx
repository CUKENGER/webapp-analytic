import { useNavigate } from 'react-router'
import { useLaunchParams } from '@telegram-apps/sdk-react'
import plural from 'plural-ru'
import { useGetProjects } from '@/api/hooks/useProjects'
import { PageLayout } from '@/atoms/PageLayout'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { ButtonBotCard } from '@/components/@common/ButtonBotCard'
import { cn } from '@/lib/utils'
import { ProjectItem } from './ProjectItem'
import { useScrollRestoration } from '@/hooks/useScrollRestoration'

// Функция для форматирования тарифа
const formatTariff = (tariff: string): string => {
  const tariffMap: Record<string, string> = {
    free: 'Бесплатный',
    trial: 'Пробный',
    profi: 'Профи',
    based: 'Базовый'
    // Добавь другие тарифы, если есть
  }
  return tariffMap[tariff.toLowerCase()] || tariff
}

// Функция для рассчёта оставшихся дней
const calculateDaysRemaining = (endDate: string | null): number => {
  if (!endDate) return 0
  try {
    const end = new Date(endDate)
    const now = new Date()
    const diffInMs = end.getTime() - now.getTime()
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    return days >= 0 ? days : 0
  } catch (e) {
    console.error('Error calculating days remaining:', e)
    return 0
  }
}

const Projects = () => {
  const launchParams = useLaunchParams()
  const tgAdminID =
    import.meta.env.VITE_TG_ADMIN_ID ??
    launchParams?.initData?.user?.id?.toString()

  // 6450597868 - базовый
  // 2085456645 - profi, trial
  // 113647192 - based

  const { data: projects } = useGetProjects({
    tgAdminID
  })

  useScrollRestoration()

  const navigate = useNavigate()

  return (
    <PageLayout>
      <div className="flex-grow">
        <BlockTitle title="Ваши проекты">
          Выберите свой канал, группу или бота, чтобы посмотреть аналитику.
        </BlockTitle>
        <div className="flex flex-col w-full gap-2 pb-padding-bottom-nav">
          {projects?.length > 0 &&
            projects.map(project => {
              const daysRemaining = calculateDaysRemaining(
                project.paidUntilEpoch
              )
              const formattedTariff = formatTariff(project.tariff)

              if (project.type === 'bot') {
                return (
                  <ButtonBotCard
                    key={project.id}
                    onClick={() => navigate(`/projects/bot/${project.id}`)}
                    name={project.tgTitle}
                  >
                    <span className="font-medium text-sm">
                      Тариф:
                      <span className="font-bold">
                        «{formattedTariff}»
                        {daysRemaining > 0 ? (
                          <span
                            className={cn(
                              daysRemaining <= 3 && 'text-tg-destructive'
                            )}
                          >
                            ({daysRemaining}{' '}
                            {plural(daysRemaining, 'день', 'дня', 'дней')})
                          </span>
                        ) : (
                          project.tariff !== 'free' && (
                            <span className="text-tg-destructive">(истёк)</span>
                          )
                        )}
                      </span>
                    </span>
                  </ButtonBotCard>
                )
              }

              return (
                <ProjectItem
                  key={project.id}
                  uuid={project.id}
                  name={project.tgTitle}
                  rate={formattedTariff}
                  daytime={daysRemaining}
                />
              )
            })}
        </div>
      </div>
    </PageLayout>
  )
}

export default Projects
