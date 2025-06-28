import { QueryCache } from '@tanstack/react-query'

const queryCache = new QueryCache({
  onError: (error) => {
    console.log(error)
  },
  onSuccess: (data) => {
    console.log(data)
  },
  onSettled: (data, error) => {
    console.log(data, error)
  },
})

export const useSelectedDirectAds = () => {

  // Получаем текущее состояние данных по ключу ['directReportAds']
  const cachedData = queryCache.find({
    queryKey: ['directReportAds']
  })
  console.log(cachedData)

  // Возвращаем данные, если они есть в кэше
  return cachedData;
}
