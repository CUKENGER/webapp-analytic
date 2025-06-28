import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useGetProject } from '@/api/hooks/useProject'
import { PageLayout } from '@/atoms/PageLayout'
import { CustomLoader } from '@/components/@common/CustomLoader'
import { UIButton } from '@/components/ui/UIButton'
import { PATHS } from '@/components/utils/paths'
import { TariffType } from '@/utils/projectConfig'
import { ProjectInfo } from './ProjectInfo'

const tariffComponents = {
  trial: { component: ProjectInfo, settings: {} },
  free: { component: ProjectInfo, settings: { showNotice: true } },
  profi: { component: ProjectInfo, settings: {} },
  based: { component: ProjectInfo, settings: {} }
} as const

const Project = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: channel, isLoading: isProjectLoading } = useGetProject({
    id: id ?? ''
  })

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      navigate('/', { replace: true })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigate])

  if (isProjectLoading) {
    return <CustomLoader />
  }

  if (!channel) {
    return (
      <PageLayout>
        <p className="text-lg text-gray font-bold">Channel not found</p>
      </PageLayout>
    )
  }

  const tariff = channel.tariff
  const tariffConfig =
    tariffComponents[tariff as TariffType] || tariffComponents.free
  const ProjectInfoComponent = tariffConfig.component
  const isDisabled = tariff === 'free'

  return (
    <PageLayout>
      <ProjectInfoComponent
        project={channel}
        tariffSettings={tariffConfig.settings}
        isClose={false}
      />
      <div className="px-6 mt-auto pt-10">
        <div className="button-container pb-padding-bottom-nav">
          <UIButton
            variant="primary"
            disabled={isDisabled}
            onClick={() => navigate(`${PATHS.projects.direct.root(id ?? '')}`)}
          >
            Посмотреть аналитику
          </UIButton>
        </div>
      </div>
    </PageLayout>
  )
}

export default Project
