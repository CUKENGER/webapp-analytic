import { ChangeEvent, InputHTMLAttributes, useRef } from 'react'
import { PhotoIcon } from '../icons/PhotoIcon'

interface UIInputFileProps extends InputHTMLAttributes<HTMLInputElement> {
	onFileChange?: (file: File | null) => void // Callback для передачи одного файла
	accept?: string // Ограничение типов файлов (например, "image/*")
	label?: string // Текст для кнопки или метки
	disabled?: boolean // Отключение ввода
}

export const UIInputFile = ({
	onFileChange,
	accept = 'image/*',
	label = 'Выбрать файл',
	disabled = false,
	...rest // Остальные HTML-атрибуты
}: UIInputFileProps) => {
	const inputRef = useRef<HTMLInputElement>(null)

	// Обработчик клика по кастомной кнопке
	const handleButtonClick = () => {
		if (inputRef.current && !disabled) {
			inputRef.current.click() // Программно вызываем клик на скрытом input
		}
	}

	// Обработчик изменения файла
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (onFileChange) {
			// Передаем первый файл (или null, если ничего не выбрано)
			onFileChange(files && files.length > 0 ? files[0] : null)
		}
	}

	return (
		<div className="inline-block">
			{/* Кастомная кнопка */}
			<button
				type="button"
				className={`w-full cursor-pointer flex gap-2 items-center
					}`}
				onClick={handleButtonClick}
				disabled={disabled}
			>
				<PhotoIcon className='rounded-full' />
				<span className='text-tg-link font-bold leading-[1.4]'>
					{label}
				</span>
			</button>

			{/* Скрытый input */}
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				multiple={false} // Явно отключаем выбор нескольких файлов
				onChange={handleFileChange}
				className="hidden"
				disabled={disabled}
				{...rest} // Передаем остальные HTML-атрибуты
			/>
		</div>
	)
}