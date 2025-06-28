import { useState } from "react";
import { useNavigate } from "react-router";
import { ProjectFull } from "@/api/types/projects.types";
import { BlockContainer } from "@/components/@common/BlockContainer";
import { BlockContentChevron } from "@/components/@common/BlockContentChevron";
import { BlockItem } from "@/components/@common/BlockItem";
import { CustomSwitch } from "@/components/ui/switch";
import { Modal } from "@/components/Modal/Modal";
import { UIButton } from "@/components/ui/UIButton";

interface ProjectSettingsProps {
	project?: ProjectFull;
	isClose?: boolean;
}

export const ProfiProjectSettings = ({
	project,
	isClose = false,
}: ProjectSettingsProps) => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	const handleTooltipClick = () => {
		setIsOpen(true); // Открываем модальное окно при клике на InfoIcon
	};

	return (
		<BlockContainer title="Настройки проекта" needBorder>
			<BlockItem>
				<CustomSwitch
					label="Ежедневный отчёт"
					tooltipOnClick={handleTooltipClick}
				/>
			</BlockItem>
			<BlockItem>
				{isClose ? (
					<BlockContentChevron
						param="Привет-бот"
						label={"Выкл"}
						needNotAvailable={false}
						needColon={false}
						needIcon
						onClick={() => navigate("bot_privet")}
					/>
				) : (
					<BlockContentChevron
						param={"Умная кнопка"}
						needNotAvailable={false}
						needColon={false}
						onClick={() => navigate(`smart_button`)}
						needIcon
					/>
				)}
			</BlockItem>
			<BlockItem>
				<BlockContentChevron
					param="Настроить доступы"
					needNotAvailable={false}
					needColon={false}
					needIcon
					onClick={() => navigate(`accesses`)}
				/>
			</BlockItem>
			<Modal
				isOpen={isOpen}
				onOpenChange={setIsOpen} // Управляем состоянием через onOpenChange
				placement="bottom"
			>
				<div className="">
					<div className="border-b border-gray-stroke text-start">
						<p className="text-base font-bold px-4 py-3 text-tg-text">
							Ежедневный отчёт
						</p>
					</div>
					<div className="text-start border-b border-gray-stroke">
						<p className="px-4 py-3 text-tg-text">
							Текст, поясняющий как работает та или иная функция. Ссылка на{" "}
							<span className="text-tg-link cursor-pointer">инструкцию</span>.
						</p>
					</div>
					<div className="px-4 py-3">
						<UIButton
							onClick={() => setIsOpen(false)}
							className="h-[38px]"
							type="button"
							variant="primary"
							shadow="none"
							fontSize="sm"
							rounded="lg"
							size="sm"
							position="center"
						>
							Понятно
						</UIButton>
					</div>
				</div>
			</Modal>
		</BlockContainer>
	);
};
