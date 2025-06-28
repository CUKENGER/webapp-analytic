import { CustomLoader } from '@/components/@common/CustomLoader';
import { DirectFilters } from '@/pages/DirectReportPages/DirectFilters/DirectFilters';
import { DirectCampaignsTable } from './components/DirectCampaignsTable';
import { DirectDaysChart } from './components/DirectDaysChart';
import { DirectDaysTable } from './components/DirectDaysTable';
import { DirectAdsContext } from './model/DirectAdsContext';
import { useDirectData } from './model/useDirectData';
import { useDirectFilters } from './model/useDirectFilters';


const DirectPage = () => {
  const {
    channelUUID,
    range,
    ads,
    setRange,
    setAds,
    columns,
    setColumns,
    prefix,
    adsData
  } = useDirectFilters()

  const {
    chartData,
    daysData,
    campaignsData,
    campaignsDataTotals,
    campaignsDataCompact,
    isLoading
  } = useDirectData({
    channelUUID,
    range,
    ads,
    setRange
  })

  if (isLoading) {
    return (
      <CustomLoader />
    )
  }

  return (
    <DirectAdsContext.Provider value={{ ads, setAds }}>
      <div className="space-y-10 pb-padding-bottom-nav">
        <div className="flex flex-col gap-10">
          <DirectFilters
            selectedAds={ads}
            selectedRange={range}
            setSelectedAds={setAds}
            setSelectedRange={setRange}
            campaigns={adsData?.data ?? []}
          />
          <DirectDaysChart chartData={chartData} prefix={prefix} />
        </div>
        <DirectDaysTable
          columns={columns}
          setColumns={setColumns}
          reportData={daysData}
        />
        <DirectCampaignsTable
          columns={columns}
          setColumns={setColumns}
          campaignsData={campaignsData}
          campaignsDataCompact={campaignsDataCompact}
          campaignsDataTotals={campaignsDataTotals}
        />
      </div>
    </DirectAdsContext.Provider>
  )
}

export default DirectPage