import { TabsList, TabsTrigger } from '@/components/ui/tabs'

export const ReportsTabsList = () => {
  return (
    <TabsList className="fixed inset-x-0 top-0 z-40 w-full bg-tg-background shadow-custom rounded-b-2xl fixed-inset-x">
      <div className="grid w-full grid-cols-3 max-w-[480px] gap-2 px-2">
        <TabsTrigger value="ad">Реклама</TabsTrigger>
        <TabsTrigger value="links">Ссылки</TabsTrigger>
        <TabsTrigger value="audience">Аудитория</TabsTrigger>
      </div>
    </TabsList>
  )
}
