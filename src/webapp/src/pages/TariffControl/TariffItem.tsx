import { ReactNode, useState } from 'react';
import { ProjectFull } from '@/api/types/projects.types';
import { Modal } from '@/components/Modal/Modal';
import { CustomRadioGroup } from '@/components/ui/radio-group';
import { UIButton } from '@/components/ui/UIButton';
import { getTariffEndDateInfo } from '@/components/utils/formatEpochToCountDays';
import { tariffMapping } from '@/utils/projectConfig';
import { PaymentConfirmation } from './PaymentConfirmation';
import { TariffItemInfo } from './tariffControlUtils';
import { cn } from '@/lib/utils'


interface TariffItemProps {
	project: ProjectFull
	tariffData: TariffItemInfo
	isCurrent?: boolean
}

export const TariffItem = ({ project, tariffData, isCurrent }: TariffItemProps) => {

	const [selectedOption, setSelectedOption] = useState("0")
	const { text, className } = getTariffEndDateInfo(Number(project?.paidUntilEpoch))  
	const [isOpen, setIsOpen] = useState(false)
	const [selectedTariffData, setSelectedTariffData] = useState<{
		tariff: string
		period: string
		price: string
	} | null>(null)


	const radioOptions = tariffData.prices.map((price, index) => ({
		value: `${tariffData.name}-${index}`,
		label: `${price.period} — ${price.price}`,
	}))

	const handleClick = () => {
		const selectedIndex = parseInt(selectedOption, 10)
		const selectedPrice = tariffData.prices[selectedIndex] // Получаем данные о выбранной цене

		const tariffDataToShow = {
			tariff: tariffData.name,
			period: selectedPrice.period,
			price: selectedPrice.price,
		}

		setSelectedTariffData(tariffDataToShow)
		setIsOpen(true)
	}

	const handleCancel = () => {
		setIsOpen(false)
	}

	const message =
		!isCurrent && project.tariff === "based" && tariffData.name === "profi"
			? tariffData.basementText
			: null

	return (
		<div className='flex w-full flex-col bg-tg-background rounded-2xl'>
			<SectionContainer>
				<p className="font-bold px-4 py-3">
					Тариф:&nbsp;
					<span>
						«{tariffMapping[tariffData.name as keyof typeof tariffMapping] || 'Неизвестный тариф'}»&nbsp;
						{isCurrent && (
							<span className={className}>{text}</span>
						)}
					</span>
				</p>
			</SectionContainer>
			<SectionContainer>
				<div className="px-4 py-3">
					<TariffFeaturesList
						features={tariffData.features}
						featuresTitle={tariffData.featuresTitle}
					/>
				</div>
			</SectionContainer>
			<SectionContainer>
				<div className="pl-4">
					<CustomRadioGroup
						classNameOption="pr-4 leading-[1.4]"
						options={radioOptions}
						value={`${tariffData.name}-${selectedOption}`}
						onChange={(value) => setSelectedOption(value.replace(`${tariffData.name}-`, ""))}
					/>
				</div>
			</SectionContainer>
			<SectionContainer hasBorder={false}>
				<TariffFooter
					message={message}
					buttonText={isCurrent ? "Продлить" : "Выбрать"}
					onClick={handleClick}
				/>
			</SectionContainer>
			<Modal
				isOpen={isOpen}
				onOpenChange={setIsOpen}
			>
				<PaymentConfirmation
					selectedTariffData={selectedTariffData}
					handleCancel={handleCancel}
				/>
			</Modal>
		</div>
	)
}

interface TariffFooterProps {
	message: string | null
	buttonText?: string
	onClick: () => void
}

export const TariffFooter = ({
	message,
	buttonText = "Выбрать",
	onClick
}: TariffFooterProps) => (
	<div className="px-4 pb-4 py-3 flex w-full flex-col gap-3">
		{message && <p className="text-sm font-medium text-gray">{message}</p>}
		<UIButton className='h-[56px]' variant="primary" position="center" onClick={onClick}>
			{buttonText}
		</UIButton>
	</div>
)

interface SectionContainerProps {
	children: ReactNode
	hasBorder?: boolean
	className?: string
}

export const SectionContainer = ({ children, hasBorder = true, className }: SectionContainerProps) => (
	<div className={cn(hasBorder && "border-b border-gray-stroke", className)}>
		{children}
	</div>
)

const TariffFeaturesList = ({
  features,
  featuresTitle
}: {
  featuresTitle: string
  features: string[]
}) => (
  <div className="text-sm text-dark-gray-stroke">
    <p>{featuresTitle}:</p>
    <ul className="pl-[6px]">
      {features.map((feature, index) => {
        const isLast = index === features.length - 1
        return (
          <li
            key={index}
            className="before:content-['•'] before:text-lg before:mr-2 before:inline-block"
          >
            {feature.endsWith(';') || feature.endsWith('.')
              ? feature
              : `${feature}${isLast ? '.' : ';'}`}
          </li>
        )
      })}
    </ul>
  </div>
)