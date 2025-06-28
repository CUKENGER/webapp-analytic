import { cn } from '@/lib/utils'
import { tariffMapping } from '@/utils/projectConfig'
import plural from "plural-ru"

interface PropTypes {
  tariff?: string
  paidUntil?: number
  text?: 'sm' | 'base'
}

export const TariffText = ({ tariff, paidUntil, text = 'base' }: PropTypes) => {
  return (
    <p className={cn("font-medium", text && `text-${text}`)}>
      Тариф:&nbsp;
      <span className="font-bold">
        «{tariffMapping[tariff as keyof typeof tariffMapping] || 'Неизвестный тариф'}»&nbsp;
        {tariff !== 'trial' && paidUntil !== undefined && (
          paidUntil > 0 ? (
            <span className={cn(paidUntil <= 3 && 'text-tg-destructive')}>
              ({paidUntil} {plural(paidUntil, 'день', 'дня', 'дней')})
            </span>
          ) : (
            <span className="text-tg-destructive">(истёк)</span>
          )
        )}
      </span>
    </p>
  )
}

