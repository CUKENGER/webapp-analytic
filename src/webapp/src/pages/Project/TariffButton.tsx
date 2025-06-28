import { cn } from '@/lib/utils'
import plural from "plural-ru"

interface PropTypes {
	tariff?: string
	paidUntil?: number
	onClick?: () => void
}

export const TariffButton = ({ tariff, paidUntil, onClick }: PropTypes) => {
	return (
		<div
			className={"rounded-2xl text-base py-3 px-4 h-[46px] " +
				"flex items-center justify-between border border-gray-stroke"}
		>
			<p className={"font-medium"}>
				Тариф:&nbsp;
				<span className="font-bold">
					«{tariff ? tariff : 'Бесплатный'}»&nbsp;
					{tariff && paidUntil !== undefined && (
						paidUntil > 0 ? (
							<span className={cn(paidUntil <= 3 && 'text-tg-destructive')}>
								({paidUntil} {plural(paidUntil, 'день', 'дня', 'дней')})
							</span>
						) : tariff !== 'Бесплатный' && (
							<span className="text-tg-destructive">(истёк)</span>
						)
					)}
				</span>
			</p>
		</div>
	)
}
