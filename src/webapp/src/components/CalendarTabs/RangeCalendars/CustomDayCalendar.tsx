// CustomDayRangeCalendar.tsx
import { cn } from "@/lib/utils"
import { useMemo, useRef } from "react"
import { MonthRenderer } from "../common/renderers"
import { DateRangeType, SelectionCalendarMode } from "../common/types"
import { useRangeSelection } from "../common/useRangeSelection"
import { useScrollConfig } from "../common/useScrollConfig"
import { combineRanges } from "../common/utils"
import { useInfiniteScrollMonth } from "../useInfiniteScrollMonth"

export const CustomDayCalendar = ({
	onRangeSelect,
	mode = "range",
	disabledUntil,
	disabledAfter,
	selectedDate,
	initialScrollDate,
}: {
	onRangeSelect: (range: DateRangeType) => void
	mode?: SelectionCalendarMode
	disabledUntil?: Date
	disabledAfter?: Date
	selectedDate?: Date | DateRangeType
	initialScrollDate?: Date
}) => {
	const containerRef = useRef<HTMLDivElement>(null)

	const { selectedRanges, handleSelection, handleMonthSelection } = useRangeSelection(
		mode,
		onRangeSelect,
		disabledUntil,
		disabledAfter,
		selectedDate,
	)

	const handleDayClick = (day: Date, event: React.MouseEvent) => {
		handleSelection({ from: day, to: day }, event)
	}

	const handleMonthClick = (month: Date, event: React.MouseEvent) => {
		handleMonthSelection(month, event)
	}

	const {
		initialItemsCount,
		itemsToLoad,
		observerRootMargin,
		observerThreshold,
	} = useScrollConfig({
		customItemsToLoad: 10,
	})

	const { items: months } = useInfiniteScrollMonth({
		containerRef,
		initialItemsCount,
		observerRootMargin,
		observerThreshold,
		itemsToLoad,
		initialScrollDate,
	})

	const combinedRange = useMemo(() => {
		if (selectedDate && !(selectedDate instanceof Date)) {
			const from = new Date(selectedDate.from)
			const to = selectedDate.to ? new Date(selectedDate.to) : from
			from.setHours(0, 0, 0, 0)
			to.setHours(23, 59, 59, 999)
			return { from, to }
		} else if (selectedDate instanceof Date) {
			const date = new Date(selectedDate)
			return { from: date, to: date }
		}
		// Если selectedDate нет, используем локальный selectedRanges
		const range = combineRanges(selectedRanges)
		const from = new Date(range.from)
		const to = range.to ? new Date(range.to) : from
		from.setHours(0, 0, 0, 0)
		to.setHours(23, 59, 59, 999)
		return { from, to }
	}, [selectedDate, selectedRanges])

	return (
		<div
			ref={containerRef}
			className={cn(
				"pb-4 rounded-lg bg-tg-background overflow-y-auto h-[60vh] hide-scrollbar w-full px-4",
			)}
		>
			{months.map((month, index) => (
				<MonthRenderer
					key={month.toString()}
					month={month}
					index={index}
					combinedRange={combinedRange}
					onDayClick={handleDayClick}
					isWeekMode={false}
					disabledUntil={disabledUntil}
					disabledAfter={disabledAfter}
					handleMonthClick={handleMonthClick}
				/>
			))}
		</div>
	)
}
