import { useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { SINGLE_MODE_TABS, TABS } from "../common/utils";

interface PropTypes {
	handleRangeSelect: (range: DateRange) => void;
	activeTab: string | null;
	setActiveTab: (tab: string | null) => void;
	isSingleMode?: boolean;
}

export const TabsContainer = ({
	handleRangeSelect,
	setActiveTab,
	activeTab,
	isSingleMode = false,
}: PropTypes) => {
	const tabsContainerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	// Обработка начала перетаскивания (ПК)
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (tabsContainerRef.current) {
			setIsDragging(true);
			setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
			setScrollLeft(tabsContainerRef.current.scrollLeft);
		}
	};

	// Обработка движения мыши (ПК)
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging || !tabsContainerRef.current) return;
		e.preventDefault();
		const x = e.pageX - tabsContainerRef.current.offsetLeft;
		const walk = (x - startX) * 1.5; // Ускорение скролла (можно настроить)
		tabsContainerRef.current.scrollLeft = scrollLeft - walk;
	};

	// Обработка окончания перетаскивания (ПК)
	const handleMouseUp = () => {
		setIsDragging(false);
	};

	// Обработка начала касания (мобильные устройства)
	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		if (tabsContainerRef.current) {
			setIsDragging(true);
			setStartX(e.touches[0].pageX - tabsContainerRef.current.offsetLeft);
			setScrollLeft(tabsContainerRef.current.scrollLeft);
		}
	};

	// Обработка движения касания (мобильные устройства)
	const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
		if (!isDragging || !tabsContainerRef.current) return;
		const x = e.touches[0].pageX - tabsContainerRef.current.offsetLeft;
		const walk = (x - startX) * 1.5; // Ускорение скролла
		tabsContainerRef.current.scrollLeft = scrollLeft - walk;
	};

	// Обработка окончания касания (мобильные устройства)
	const handleTouchEnd = () => {
		setIsDragging(false);
	};

	// Функция для вычисления диапазона дат
	const getDateRangeFromTab = (tab: string): DateRange => {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Устанавливаем начало дня
		let from: Date = today;
		let to: Date = today;

		switch (tab) {
			case "Сегодня":
				from = today;
				to = today;
				break;
			case "Вчера":
				from = new Date(today);
				from.setDate(today.getDate() - 1);
				to = from;
				break;
			case "7 дней":
				from = new Date(today);
				from.setDate(today.getDate() - 6); // 7 дней включая сегодня
				to = today;
				break;
			case "30 дней":
				from = new Date(today);
				from.setDate(today.getDate() - 29); // 30 дней включая сегодня
				to = today;
				break;
			case "90 дней":
				from = new Date(today);
				from.setDate(today.getDate() - 89); // 90 дней включая сегодня
				to = today;
				break;
			case "365 дней":
				from = new Date(today);
				from.setDate(today.getDate() - 364); // 365 дней включая сегодня
				to = today;
				break;
			default:
				from = today;
				to = today;
		}

		return { from, to };
	};

	const getSingleDateFromTab = (tab: string): DateRange => {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Устанавливаем начало дня
		let from: Date = today;
		let to: Date = today;

		switch (tab) {
			case "Сегодня":
				from = today;
				to = today;
				break;
			case "Завтра":
				from = new Date(today);
				from.setDate(today.getDate() + 1);
				to = from;
				break;
			case "7 дней":
				from = new Date(today);
				from.setDate(today.getDate() + 7); // 7 дней включая сегодня
				to = today;
				break;
			case "30 дней":
				from = new Date(today);
				from.setDate(today.getDate() + 30); // 30 дней включая сегодня
				to = today;
				break;
			case "90 дней":
				from = new Date(today);
				from.setDate(today.getDate() + 90); // 90 дней включая сегодня
				to = today;
				break;
			case "365 дней":
				from = new Date(today);
				from.setDate(today.getDate() + 365); // 365 дней включая сегодня
				to = today;
				break;
			default:
				from = today;
				to = today;
		}

		return { from, to };
	};

	const handleSelectTab = (tab: string) => {
		let range: DateRange;
		if (isSingleMode) {
			range = getSingleDateFromTab(tab);
		} else {
			range = getDateRangeFromTab(tab);
		}
		handleRangeSelect(range); // Передаем диапазон в родительский компонент
		setActiveTab(tab); // Устанавливаем активный таб
	};

  const tabsToMap = isSingleMode ? SINGLE_MODE_TABS : TABS;

	return (
		<div
			ref={tabsContainerRef}
			className={cn(
				"flex border-b border-gray-stroke overflow-x-auto hide-scrollbar select-none",
        isSingleMode ? 'justify-between rounded-tr-2xl' : 'rounded-tr-2xl rounded-tl-2xl'
			)}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			{tabsToMap.map((tab, index) => (
				<button
					key={tab}
					className={cn(
						`px-4 py-3 border-none font-bold text-sm text-tg-link whitespace-nowrap hover:bg-light-gray-back focus-visible:outline-none`,
						{
							"rounded-tl-2xl": index === 0,
							"rounded-tr-2xl": index === TABS.length - 1,
							"bg-light-gray-back text-gray": activeTab === tab,
						},
					)}
					onClick={() => handleSelectTab(tab)}
				>
					{tab}
				</button>
			))}
		</div>
	);
};
