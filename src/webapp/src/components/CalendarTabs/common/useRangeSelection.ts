// hooks/useRangeSelection.ts
import { useCallback, useEffect, useState } from "react";
import { DateRangeType, SelectionCalendarMode } from "./types";
import { combineRanges} from "./utils";
import { startOfMonth, endOfMonth } from 'date-fns'

export const useRangeSelection = (
	mode: SelectionCalendarMode,
	onRangeSelect: (range: DateRangeType) => void,
	disabledUntil?: Date,
	disabledAfter?: Date,
	selectedDate?: Date | DateRangeType,
) => {
	const [selectedRanges, setSelectedRanges] = useState<DateRangeType[]>([]);

	// Синхронизация selectedRanges с selectedDate при монтировании и изменении пропсов
	useEffect(() => {
		const initialRanges = selectedDate
			? selectedDate instanceof Date
				? [{ from: new Date(selectedDate), to: new Date(selectedDate) }]
				: [{ from: new Date(selectedDate.from), to: new Date(selectedDate.to) }]
			: [];
		setSelectedRanges(initialRanges);
	}, [selectedDate]);


	// Обработка для mode === 'single'
	const handleSingleSelection = useCallback(
		(newRange: DateRangeType, event: React.MouseEvent) => {
			const { from } = newRange;

			if (
				(disabledUntil && isBefore(from, disabledUntil)) ||
				(disabledAfter && isAfter(from, disabledAfter))
			) {
				return;
			}

			const updatedRanges = [{ from, to: from }];
			setSelectedRanges(updatedRanges);
			onRangeSelect(combineRanges(updatedRanges));
		},
		[disabledUntil, disabledAfter, onRangeSelect],
	);

	// Обработка для mode === 'range'
	const handleRangeSelection = useCallback(
		(newRange: DateRangeType, event: React.MouseEvent) => {
			const { from } = newRange;

			if (
				(disabledUntil && isBefore(from, disabledUntil)) ||
				(disabledAfter && isAfter(from, disabledAfter))
			) {
				return;
			}

			const updatedRanges = (() => {
				const currentRange = selectedRanges[0] || { from: null, to: null };

				// Если есть полный диапазон (from и to разные)
				if (
					currentRange.from &&
					currentRange.to &&
					currentRange.from.getTime() !== currentRange.to.getTime()
				) {
					// Клик внутри диапазона — сброс до одной даты
					if (from >= currentRange.from && from <= currentRange.to) {
						return [{ from, to: from }];
					}
					// Клик вне диапазона — новый выбор одной даты
					return [{ from, to: from }];
				}

				// Если выбрана одна дата (from и to одинаковые или to нет)
				if (
					currentRange.from &&
					(!currentRange.to ||
						currentRange.from.getTime() === currentRange.to.getTime())
				) {
					const startDate = currentRange.from;
					const endDate = from;

					// Если кликнули на ту же дату, оставляем как есть
					if (startDate.getTime() === endDate.getTime()) {
						return selectedRanges;
					}

					// Создаем диапазон
					return [
						{
							from: startDate <= endDate ? startDate : endDate,
							to: startDate <= endDate ? endDate : startDate,
						},
					];
				}

				// Первый клик — выбираем одну дату
				return [{ from, to: from }];
			})();

			setSelectedRanges(updatedRanges);
			onRangeSelect(combineRanges(updatedRanges));
		},
		[disabledUntil, disabledAfter, onRangeSelect, selectedRanges],
	);

	// Выбор функции в зависимости от mode
	const handleSelection = useCallback(
		(newRange: DateRangeType, event: React.MouseEvent) => {
			if (mode === "single" || event.detail === 2 || event.button === 1) {
				handleSingleSelection(newRange, event);
			} else {
				handleRangeSelection(newRange, event);
			}
		},
		[mode, handleSingleSelection, handleRangeSelection],
	);

	// Новая функция для выбора полного месяца
	const handleMonthSelection = useCallback(
		(month: Date, event: React.MouseEvent) => {
			const from = startOfMonth(month)
			const to = endOfMonth(month)

			// Учитываем ограничения disabledUntil и disabledAfter
			const adjustedFrom = disabledUntil && from < disabledUntil ? new Date(disabledUntil) : new Date(from)
			const adjustedTo = disabledAfter && to > disabledAfter ? new Date(disabledAfter) : new Date(to)

			// Устанавливаем время на начало и конец дня
			adjustedFrom.setHours(0, 0, 0, 0)
			adjustedTo.setHours(23, 59, 59, 999)

			// Проверяем, что диапазон валиден
			if (
				(disabledUntil && isBefore(adjustedTo, disabledUntil)) ||
				(disabledAfter && isAfter(adjustedFrom, disabledAfter))
			) {
				return
			}

			const updatedRanges = [{ from: adjustedFrom, to: adjustedTo }]
			setSelectedRanges(updatedRanges)
			onRangeSelect(combineRanges(updatedRanges))
		},
		[disabledUntil, disabledAfter, onRangeSelect]
	);

	const resetSelection = useCallback(() => {
		const initialRanges = selectedDate
			? selectedDate instanceof Date
				? [{ from: new Date(selectedDate), to: new Date(selectedDate) }]
				: [{ from: new Date(selectedDate.from), to: new Date(selectedDate.to) }]
			: [];
		setSelectedRanges(initialRanges);
	}, [selectedDate]);

	return { selectedRanges, handleSelection, resetSelection, setSelectedRanges, handleMonthSelection };
};

function isBefore(date1: Date, date2: Date): boolean {
	return date1.getTime() < date2.getTime();
}

function isAfter(date1: Date, date2: Date): boolean {
	return date1.getTime() > date2.getTime();
}
