import React, { isValidElement, ReactElement, useRef } from "react"
import { cn } from "@/lib/utils"
import { useMyDropdownMenu } from './useMyDropdownMenu'
import styles from './Modal.module.css'

interface ModalProps {
	children: React.ReactNode
	containerClassName?: string
	onClose?: () => void
	isOpen?: boolean
	onOpenChange?: (value: boolean) => void
	placement?: "center" | "bottom"
}

function Modal({
	children,
	containerClassName,
	onClose,
	isOpen: externalIsOpen,
	onOpenChange,
	placement = "bottom",
}: ModalProps) {
	const menuRef = useRef<HTMLDivElement>(null)
	const menuContentRef = useRef<HTMLDivElement>(null)

	const { isOpen, closeMenu } = useMyDropdownMenu(
		{
			externalIsOpen,
			menuContentRef,
			menuRef,
			placement,
			onClose,
			onOpenChange,
		},
	)

	return (
		<div className={cn("relative", containerClassName)} ref={menuRef}>
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
						`mx-auto sm:max-w-3xl lg:max-w-7xl bg-tg-background rounded-2xl shadow-lg border-t`,
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
	)
}

export { Modal }
