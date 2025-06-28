import * as React from "react";
import { isValidElement, ReactElement, useCallback, useState } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { ChevronDownIcon } from "lucide-react";
import { sharedVariants } from "@/lib/sharedVariants";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetPortal = SheetPrimitive.Portal;

interface DropdownMenuProps {
	title?: string;
	count?: number | string;
	icon?: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
	children: React.ReactNode;
	content?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	isOpen?: boolean;
	onOpenChange?: (value: boolean) => void;
	side?: 'bottom' | 'center';
}

function DropdownMenu({
	title,
	count,
	icon,
	children,
	content,
	className,
	disabled,
	isOpen: externalIsOpen,
	onOpenChange,
	side = "bottom",
}: DropdownMenuProps) {
	const [isOpen, setIsOpen] = useState(externalIsOpen ?? false);

	React.useEffect(() => {
		if (externalIsOpen !== undefined) {
			setIsOpen(externalIsOpen);
		}
	}, [externalIsOpen]);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!disabled) {
				setIsOpen(open);
				if (onOpenChange) {
					onOpenChange(open);
				}
			}
		},
		[onOpenChange, disabled],
	);

	const closeMenu = useCallback(() => {
		if (!disabled) {
			setIsOpen(false);
			if (onOpenChange) {
				onOpenChange(false);
			}
		}
	}, [onOpenChange, disabled]);

	// Если icon — функция, вызываем её с isOpen, иначе используем как есть
	const renderedIcon = typeof icon === "function" ? icon(isOpen) : icon;

	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<MySheetTrigger
				title={title}
				count={count}
				icon={renderedIcon}
				className={className}
				disabled={disabled}
			>
				{content}
			</MySheetTrigger>
			<MySheetContent side={side}>
				<SheetPrimitive.Title className="sr-only">
					{title || "Dialog Title"}
				</SheetPrimitive.Title>
				<SheetPrimitive.Description className="sr-only">
					{title || "Description of the dialog content"}
				</SheetPrimitive.Description>
				{isValidElement(children)
					? React.cloneElement(children as ReactElement, { onClose: closeMenu })
					: children}
			</MySheetContent>
		</Sheet>
	);
}

function ChevronDropdownIcon({ isOpen }: { isOpen: boolean }) {
	return (
		<ChevronDownIcon
			className={`text-tg-primary ${isOpen ? "rotate-180" : ""}`}
			aria-hidden
			width={25}
			height={25}
		/>
	);
}

const SheetOverlay = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Overlay
		className={cn("fixed inset-0 z-50 bg-black/80", className)}
		{...props}
		ref={ref}
	/>
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

interface SheetContentProps
	extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
		VariantProps<typeof sharedVariants> {}

const SheetContent = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Content>,
	SheetContentProps
>(({ side, className, children, ...props }, ref) => (
	<SheetPortal>
		<SheetOverlay />
		<SheetPrimitive.Content
			ref={ref}
			className={cn(sharedVariants({ side }), className)}
			{...props}
		>
			{children}
		</SheetPrimitive.Content>
	</SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

function MySheetTrigger({
	title,
	children,
	count,
	icon,
	className,
	disabled,
}: {
	title?: string;
	children?: React.ReactNode;
	count?: number | string;
	icon?: React.ReactNode;
	className?: string;
	disabled?: boolean;
}) {
	return (
		<SheetTrigger
			className={cn(
				"flex flex-col w-full gap-0.5 p-4 bg-tg-background rounded-2xl text-tg-text",
				className,
			)}
			disabled={disabled}
		>
			{title && <p className="text-left">{title}</p>}
			<div className="flex items-center justify-between w-full gap-2">
				<div className="overflow-hidden font-bold max-w-[80%] text-ellipsis whitespace-nowrap truncate">
					{children}
				</div>
				<div className="flex items-center gap-1.5">
					{count && (
						<div className="flex items-center justify-center w-6 h-6 text-sm font-bold text-center rounded-sm text-tg-primary-text bg-tg-accent">
							{count}
						</div>
					)}
					{icon}
				</div>
			</div>
		</SheetTrigger>
	);
}

function MySheetContent({
	side,
	children,
}: {
	side: 'bottom' | 'center';
	children: React.ReactNode;
}) {
	return (
		<SheetContent
			side={side}
			className={cn(
				"max-w-xl mx-auto sm:max-w-3xl lg:max-w-7xl bg-tg-background",
				side === "bottom"
					? "rounded-t-2xl"
					: side === "center"
						? "w-[90vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl rounded-2xl"
						: "",
			)}
		>
			{children}
		</SheetContent>
	);
}

export { ChevronDropdownIcon, DropdownMenu };
