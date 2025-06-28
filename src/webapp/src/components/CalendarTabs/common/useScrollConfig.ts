
interface PropTypes {
  customInitialItemsCount?: number
  customItemsToLoad?: number
  customObserverRootMargin?: string
  customObserverThreshold?: number
}

export const useScrollConfig = ({
  customInitialItemsCount = 10,
  customItemsToLoad = 6,
  customObserverRootMargin = '350px',
  customObserverThreshold = 0.4
}: PropTypes) => {
  const isAppleDevice = () =>
    /(iPhone|iPad|iPod|Mac)/i.test(navigator.userAgent)
  const initialItemsCount = isAppleDevice() ? 12 : customInitialItemsCount
  const observerRootMargin = isAppleDevice() ? '700px' : customObserverRootMargin
  const observerThreshold = isAppleDevice() ? 0.7 : customObserverThreshold
  const itemsToLoad = isAppleDevice() ? 1 : customItemsToLoad

  return {
    initialItemsCount,
    observerRootMargin,
    observerThreshold,
    itemsToLoad
  }
}
