import { useParams } from 'react-router'
import { useGetProject } from '@/api/hooks/useProject'
import { PageLayout } from '@/atoms/PageLayout'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { tariffs, TariffType } from './tariffControlUtils'
import { TariffItem } from './TariffItem'

const TariffControl = () => {
  const { id } = useParams<{ id: string }>()
  const { data: project } = useGetProject({ id: id || '' })

  const currentTariff = project?.tariff as TariffType
  // const currentTariff = 'based' as TariffType
  const isTrial = currentTariff === 'trial' || 'free'

  const currentTariffData = tariffs.find(t => t.name === currentTariff)
  const nextTariffData = tariffs.find(
    t => t.name === (isTrial ? 'based' : 'profi')
  )
  const profiTariffData = tariffs.find(t => t.name === 'profi')

  if (!project) {
    return (
      <div>
        <p>Произошла ошибка повторите позже</p>
      </div>
    )
  }

  return (
    <PageLayout className="bg-tg-secondary">
      <div className="flex flex-col gap-4 pb-padding-bottom-nav">
        <BlockTitle title="Управление тарифом" className="mb-0">
          Оплачивая тариф, вы соглашаетесь с условиями{' '}
          <span className="text-tg-link cursor-pointer">оферты</span>.
        </BlockTitle>
        {isTrial ? (
          <>
            <TariffItem
              project={project}
              tariffData={tariffs[1]}
              isCurrent={false}
            />{' '}
            {/* "based" */}
            <TariffItem
              project={project}
              tariffData={tariffs[0]}
              isCurrent={false}
            />{' '}
            {/* "profi" */}
          </>
        ) : (
          <>
            <TariffItem
              project={project}
              tariffData={currentTariffData!}
              isCurrent={true}
            />
            {nextTariffData && currentTariff !== 'profi' && (
              <TariffItem
                project={project}
                tariffData={profiTariffData!}
                isCurrent={false}
              />
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}

export default TariffControl
