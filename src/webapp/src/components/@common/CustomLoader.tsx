import { ReactNode } from "react"
import { LogoDimmer } from "../icons/LogoDimmer"

interface CustomLoaderProps {
	error?: Error | null
	children?: ReactNode
}

export const CustomLoader = ({ error, children }: CustomLoaderProps) => {
	return (
		<div className="absolute inset-0 h-svh">
			{children}
			<div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-tg-background bg-opacity-20">
				<LogoDimmer />
				<div className="absolute bottom-0 left-0 right-0 h-[2px]">
					{" "}
					<div className="h-full w-0 animate-progress bg-tg-link" />
				</div>
			</div>
			{error && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-red-50 p-4">
					<div className="text-red-600 font-bold text-center">
						<p>Произошла ошибка:</p>
						<p>{error.message}</p>
					</div>
				</div>
			)}
		</div>
	)
}
