import { lazy, Suspense, useCallback } from 'react'
import { CustomLoader } from '@/components/@common/CustomLoader'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import { ReportsTabsList } from './DirectReportPages/components/ReportsTabsList/ReportsTabsList'

const DirectPage = lazy(() => import('@/pages/DirectReportPages/DirectPage'))
const LinksPage = lazy(() => import('@/pages/Links/LinksPage'))
const AudiencePage = lazy(() => import('./Audience/AudiencePage'))
const ReportContent = lazy(() => import('./ReportContent/ReportContent'))
const ReportProject = lazy(() => import('./ReportProject/ReportProject'))

const ReportsPage = () => {
  const [selectedTab, setTab] = useSearchState<string>('rtab', 'ad')

  const handleChangeTab = useCallback(
    (value: string) => {
      setTab(value)
    },
    [setTab]
  )

  return (
    <div className="bg-tg-secondary">
      <div className="max-w-screen-reports-max-screen px-4 pb-0 mx-auto w-full">
        <Tabs
          defaultValue={selectedTab}
          value={selectedTab}
          onValueChange={handleChangeTab}
        >
          <ReportsTabsList />
          <Suspense fallback={<CustomLoader />}>
            <TabsContent
              value="ad"
              className="pt-tabs-height min-h-screen sizing-box"
            >
              <DirectPage />
            </TabsContent>
            <TabsContent
              value="links"
              className="pt-tabs-height min-h-screen sizing-box"
            >
              <LinksPage />
            </TabsContent>
            <TabsContent
              value="audience"
              className="pt-tabs-height min-h-screen sizing-box"
            >
              <AudiencePage />
            </TabsContent>
          </Suspense>
        </Tabs>
      </div>
    </div>
  )
}

export default ReportsPage
