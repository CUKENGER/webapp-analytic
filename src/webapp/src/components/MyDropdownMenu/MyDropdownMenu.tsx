import React, { isValidElement, ReactElement, useRef } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./MyDropdownMenu.module.css";
import { useMyDropdownMenu } from "./useMyDropdownMenu";

interface MyDropdownMenuProps {
	title?: string;
	count?: number | string;
	icon?: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
	children: React.ReactNode;
	content?: React.ReactNode;
	containerClassName?: string;
	className?: string;
	onClose?: () => void;
	isOpen?: boolean;
	onOpenChange?: (value: boolean) => void;
	placement?: "center" | "bottom";
	trigger?: React.ReactNode;
	classNameContainerContent?: string
}

function MyDropdownMenu({
	title,
	count,
	icon,
	children,
	content,
	containerClassName,
	className,
	onClose,
	isOpen: externalIsOpen,
	onOpenChange,
	placement = "bottom",
	trigger,
	classNameContainerContent
}: MyDropdownMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null);
	const menuContentRef = useRef<HTMLDivElement>(null);

	const { isOpen, toggleMenu, getMenuTransform, closeMenu } = useMyDropdownMenu(
		{
			externalIsOpen,
			menuContentRef,
			menuRef,
			placement,
			onClose,
			onOpenChange,
		},
	);

	const renderedIcon = typeof icon === "function" ? icon(isOpen) : icon;

	// Добавляем обработчик toggleMenu к триггеру
	const triggerWithHandler = isValidElement(trigger)
		? React.cloneElement(trigger as ReactElement, {
				onClick: toggleMenu,
			})
		: trigger;

	return (
		<div className={cn("relative", containerClassName)} ref={menuRef}>
			{/* Триггер рендерится напрямую */}
			{triggerWithHandler}
			{/* Триггер */}
			<button
				className={cn(
					"flex flex-col w-full gap-0.5 p-4 bg-tg-background rounded-2xl text-tg-text",
					className,
				)}
				type="button"
				onClick={toggleMenu}
			>
				{title && <p className="text-left text-gray">{title}</p>}
				<div className="flex items-center justify-between w-full gap-2">
					<div className={cn("overflow-hidden font-bold max-w-[80%] text-ellipsis whitespace-nowrap truncate", classNameContainerContent)}>
						{content}
					</div>
					<div className="flex items-center gap-1.5">
						{count && (
							<div className="flex items-center justify-center size-6 text-sm font-bold text-center rounded-sm text-tg-primary-text bg-tg-accent aspect-square">
								{count}
							</div>
						)}
						{renderedIcon}
					</div>
				</div>
			</button>

			{placement === "bottom" ? (
				<div
					className={cn(
						"fixed bottom-0 left-0 right-0 z-50 max-w-[480px] mx-auto bg-tg-background rounded-t-2xl shadow-lg",
						styles.transformGpu,
						styles.transitionTransformOpacity,
						"duration-300 modal-transition",
						isOpen ? "translate-y-0 opacity-100" : "opacity-0",
					)}
					style={{
						transform: isOpen ? "translateY(0)" : `translateY(100%)`,
					}}
				>
					{isValidElement(children)
						? React.cloneElement(children as ReactElement, {
								onClose: closeMenu,
							})
						: children}
				</div>
			) : (
				<div
					className={cn(
						"fixed bottom-1/2 transform-translate-1/2 left-0 right-0 z-50 max-w-xl",
						`mx-auto sm:max-w-3xl lg:max-w-7xl bg-tg-background rounded-2xl shadow-lg`,
						"transition-opacity duration-300 ease-out",
						isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
					)}
				>
					{isValidElement(children)
						? React.cloneElement(children as ReactElement, {
								onClose: closeMenu,
							})
						: children}
				</div>
			)}

			{/* Оверлей - используем портал для рендеринга вне DOM-дерева */}
			{isOpen && (
				<div
					className={cn("custom-overlay", styles.overlay, styles.animateFadeIn)}
					onClick={closeMenu}
				/>
			)}
		</div>
	);
}

function ChevronDropdownIcon({ isOpen }: { isOpen: boolean }) {
	return (
		<ChevronDownIcon
			className={cn(
				styles.chevronIcon,
				"text-tg-primary",
				isOpen && styles.chevronIconOpen,
			)}
			aria-hidden
			width={20}
			height={20}
		/>
	);
}

export { ChevronDropdownIcon, MyDropdownMenu as MyDropdownMenu };
