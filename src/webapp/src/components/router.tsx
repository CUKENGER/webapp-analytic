// Ленивая загрузка компонентов
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { App } from './App';
import { ErrorPage } from './ErrorBoundary/ErrorPage';
import { PATHS } from './utils/paths';

const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))
const DirectTableFullyAudience = lazy(
  () => import('@/pages/DirectReportPages/components/DirectTableFullyAudience')
)
const DirectTableFullyCampaigns = lazy(
  () => import('@/pages/DirectReportPages/components/DirectTableFullyCampaigns')
)
const DirectTableFullyDays = lazy(
  () => import('@/pages/DirectReportPages/components/DirectTableFullyDays')
)
const DirectTableFullyLinks = lazy(
  () => import('@/pages/DirectReportPages/components/DirectTableFullyLinks')
)
const AddLinks = lazy(() => import('@/pages/Links/AddLinks'))
const EditLinks = lazy(() => import('@/pages/Links/EditLinks'))
const Project = lazy(() => import('@/pages/Project/Project'))
const Projects = lazy(() => import('@/pages/Projects/Projects'))
const ReportsPage = lazy(() => import('@/pages/ReportsPage'))
const BotCard = lazy(() => import('@/pages/BotCard/BotCard'))
const BotDirectPage = lazy(() => import('@/pages/BotDirectPage/BotDirectPage'))
const DirectTableFullyBotDays = lazy(
  () => import('@/pages/DirectReportPages/components/DirectTableFullyBotDays')
)
const DirectTableFullyBotCampaigns = lazy(
  () =>
    import('@/pages/DirectReportPages/components/DirectTableFullyBotCampaigns')
)
const DirectTableFullyLinksDays = lazy(
  () => import('@/pages/DirectReportPages/components/DirectTableFullyLinksDays')
)


// const TariffControl = lazy(() => import('@/pages/TariffControl/TariffControl'))
// const TariffControlSuccess = lazy(
//   () => import('@/pages/TariffControl/TariffControlSuccess')
// )
// const LandingControl = lazy(
//   () => import('@/pages/LandingControl/LandingControl')
// )
// const DirectControl = lazy(() => import('@/pages/DirectControl/DirectControl'))
// const SmartButtonControl = lazy(
//   () => import('@/pages/SmartButtonControl/SmartButtonControl')
// )
// const AccessControl = lazy(() => import('@/pages/AccessControl/AccessControl'))
// const BotPrivetControl = lazy(
//   () => import('@/pages/BotPrivetControl/BotPrivetControl')
// )
// const BotPrivetItemNew = lazy(
//   () => import('@/pages/BotPrivetItemNew/BotPrivetItemNew')
// )
// const BotPrivetEdit = lazy(() => import('@/pages/BotPrivetEdit/BotPrivetEdit'))
// const AddChannel = lazy(() => import('@/pages/AddChannel/AddChannel'))
// const AddBot = lazy(() => import('@/pages/AddBot/AddBot'))
// const AddGroup = lazy(() => import('@/pages/AddGroup/AddGroup'))
// const OperationResult = lazy(
//   () => import('@/pages/OperationResult/OperationResult')
// )
// const AccessFindUser = lazy(
//   () => import('@/pages/AccessFindUser/AccessFindUser')
// )
// const BotType = lazy(() => import('@/pages/BotType/BotType'))
// const ConnectLanding = lazy(
//   () => import('@/pages/ConnectLanding/ConnectLanding')
// )
// const Instructions = lazy(() => import('@/pages/Instructions/Instructions'))
// const Help = lazy(() => import('@/pages/Help/Help'))
// const About = lazy(() => import('@/pages/About/About'))
// const Stats = lazy(() => import('@/pages/About/Stats'))
// const RequestForAd = lazy(() => import('@/pages/RequestForAd/RequestForAd'))
// const RequestAdResult = lazy(
//   () => import('@/pages/RequestAdResult/RequestAdResult')
// )
// const ReferralProgram = lazy(
//   () => import('@/pages/ReferralProgram/ReferralProgram')
// )

export const router = createBrowserRouter([
  {
    element: <App />, // App оборачивает все маршруты
    errorElement: <ErrorPage />, // Глобальная обработка ошибок
    children: [
      { path: '/', element: <Projects /> },

      {
        path: 'projects',
        children: [
          { index: true, element: <Navigate to={PATHS.root} /> },
          { path: PATHS.projects.project(':id'), element: <Project /> },
          { path: PATHS.projects.bot.card(':id'), element: <BotCard /> },
          // { path: PATHS.projects.bot.type(':id'), element: <BotType /> },
          { path: '/projects/bot/:id/direct', element: <BotDirectPage /> },
          // {
          //   path: PATHS.projects.tariff.root(':id'),
          //   element: <TariffControl />
          // },
          // {
          //   path: PATHS.projects.tariff.success(':id'),
          //   element: <TariffControlSuccess />
          // },
          // {
          //   path: PATHS.projects.landing.root(':id'),
          //   element: <LandingControl />
          // },
          // {
          //   path: PATHS.projects.landing.connect(':id'),
          //   element: <ConnectLanding />
          // },
          // {
          //   path: PATHS.projects.smartButton(':id'),
          //   element: <SmartButtonControl />
          // },
          // {
          //   path: PATHS.projects.accesses.root(':id'),
          //   element: <AccessControl />
          // },
          // {
          //   path: PATHS.projects.accesses.find(':id'),
          //   element: <AccessFindUser />
          // },
          // {
          //   path: PATHS.projects.botPrivet.root(':id'),
          //   element: <BotPrivetControl />
          // },
          // {
          //   path: PATHS.projects.botPrivet.add(':projectId', ':id'),
          //   element: <BotPrivetItemNew />
          // },
          // {
          //   path: PATHS.projects.botPrivet.edit(':projectId', ':id'),
          //   element: <BotPrivetEdit />
          // },
          {
            path: '/projects/bot/:id/direct/days',
            element: <DirectTableFullyBotDays />
          },
          {
            path: '/projects/bot/:id/direct/campaigns',
            element: <DirectTableFullyBotCampaigns />
          },
          {
            path: ':id/direct',
            children: [
              { index: true, element: <ReportsPage /> },
              { path: 'days', element: <DirectTableFullyDays /> },
              { path: 'audience', element: <DirectTableFullyAudience /> },
              { path: 'campaigns', element: <DirectTableFullyCampaigns /> },
              { path: 'links', element: <DirectTableFullyLinks /> },
              { path: 'links/days', element: <DirectTableFullyLinksDays /> },
              { path: 'links/add', element: <AddLinks /> },
              { path: 'links/edit/:linkId', element: <EditLinks /> }
            ]
          },
          {
            path: 'add',
            children: [
              { index: true, element: <Navigate to={PATHS.root} /> },
              // { path: PATHS.projects.add.channel, element: <AddChannel /> },
              // { path: PATHS.projects.add.bot, element: <AddBot /> },
              // { path: PATHS.projects.add.group, element: <AddGroup /> }
            ]
          },
          // {
          //   path: PATHS.projects.yDirect(':id'),
          //   element: <DirectControl />
          // }
        ]
      },
      // { path: PATHS.result, element: <OperationResult /> },
      // { path: PATHS.instructions, element: <Instructions /> },
      // {
      //   path: PATHS.help.root,
      //   children: [
      //     { index: true, element: <Help /> },
      //     { path: PATHS.help.request, element: <RequestForAd /> },
      //     { path: PATHS.help.requestResult, element: <RequestAdResult /> }
      //   ]
      // },
      // {
      //   path: PATHS.about.root,
      //   children: [
      //     { index: true, element: <About /> },
      //     { path: PATHS.about.referral, element: <ReferralProgram /> },
      //     { path: PATHS.about.referralStats, element: <Stats /> }
      //   ]
      // },
      { path: '*', element: <NotFound /> }
    ]
  }
])