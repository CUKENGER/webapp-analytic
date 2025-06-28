import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockContentChevron } from '@/components/@common/BlockContentChevron'
import { BlockItem } from '@/components/@common/BlockItem'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { ModalMessage } from '@/components/@common/ModalMessage'
import { SectionTitle } from '@/components/@common/SectionTitle'
import { Modal } from '@/components/Modal/Modal'
import { CustomSwitch } from '@/components/ui/switch'
import { UIButton } from '@/components/ui/UIButton'
import { UIInputFile } from '@/components/ui/UIInputFile'
import { UITextareaField } from '@/components/ui/UITextareaField'
import { UITextField } from '@/components/ui/UITextField'
import { useModal } from '@/hooks/useModal'
import { SectionContainer } from '../TariffControl/TariffItem'
import { MainContainerButton } from '@/components/@common/MainContainerButton'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { Notice } from '@/components/@common/Notice'
import { useToast } from '@/hooks/use-toast'
import { useNavigate, useParams } from 'react-router'
import { FormPageLayout } from '@/atoms/FormPageLayout'

interface FormData {
	joinRequests: boolean
	message: string
	messageImage: File | null
	buttonText: string
	buttonLink: string
}

interface FormDataWithBase64 extends Omit<FormData, 'messageImage'> {
	messageImage: string | null // Base64 строка или null
}

const BotPrivetItemNew = () => {
	const { id } = useParams()

	const { closeModal, isOpen, modalType, openModal } = useModal()
	const navigate = useNavigate()
	const { toast } = useToast()
	const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FormData>({
		defaultValues: {
			joinRequests: true,
			message: "👋 Здравствуйте. Подтвердите, что вы человек! Нажмите кнопку «✅ Начать» или /start",
			messageImage: null,
			buttonText: "✅ Начать",
			buttonLink: "t.me/bot_name_1?start=privet"
		}
	})

	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = (data: FormData) => {
		console.log('Form submitted:', data)
		setIsLoading(true)
		setTimeout(() => {
			setIsLoading(false)
			toast({
				description: "Данные успешно сохранены"
			})
			navigate(`/projects/${id}/bot_privet`)
			reset()
		}, 1000)
	}

	const onCancel = () => {
		reset()
		navigate(`/projects/${id}/bot_privet`)
	}

	const photoFile = watch('messageImage')

	return (
		<FormPageLayout onSubmit={handleSubmit(onSubmit)} className='bg-tg-secondary'>
			<BlockTitle title="Привет-бот">
				Настройте привет-бот
			</BlockTitle>
			<div className='flex w-full flex-col gap-4'>
				<BlockContainer className='mt-0 px-0'>
					<BlockContentChevron className="py-3 pr-4" param='Бот' value='Название бота №1' needHover={false} />
					<BlockContentChevron className="py-3 pr-4" param='Юзернейм' value='@bot_name_1' needHover={false} />
				</BlockContainer>

				<BlockContainer className='mt-0'>
					<BlockItem>
						<CustomSwitch
							label="Принимать заявки"
							tooltipOnClick={() => openModal('everyday')}
							{...register('joinRequests')}
						/>
					</BlockItem>
				</BlockContainer>

				<BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
					<SectionContainer hasBorder={false}>
						<div className='border-b border-gray-stroke'>
							<SectionTitle title='Сообщение' />
						</div>
						<SectionContainer>
							<div className='py-3 px-4 flex flex-col items-start gap-2 block-item--hover'>
								<Controller
									name="messageImage"
									control={control}
									render={({ field: controllerField }) => (
										<>
											<UIInputFile
												onFileChange={controllerField.onChange}
												accept="image/*"
												label="Выбрать изображение"
												disabled={isLoading}
											/>
											{photoFile && <img src={URL.createObjectURL(photoFile)} alt="Preview" className="w-40 h-40 object-cover rounded-md" />}
										</>
									)}
								/>
								<div>
									<p className='text-gray text-sm text-start leading-[1.4]'>
										Изображение в формате JPG или PNG.
									</p>
								</div>
							</div>
						</SectionContainer >
						<div className='py-3 px-4'>
							<Controller
								name='message'
								rules={{
									required: 'Сообщение обязательно',
									maxLength: { value: 200, message: 'Максимум 200 символов' },
								}}
								control={control}
								render={({ field }) => (
									<UITextareaField
										{...field}
										footerLabel="Напишите сообщение, которое будет присылать ваш бот всем, кто подал заявку в ваш закрытый канал."
									/>
								)}
							/>
							{errors.message && <Notice error>{errors.message.message}</Notice>}
						</div>
					</SectionContainer>
				</BlockContainer>

				<BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
					<SectionContainer hasBorder={false}>
						<div className='border-b border-gray-stroke'>
							<SectionTitle title='Кнопка' />
						</div>
						<SectionContainer >
							<div className='py-3 px-4'>
								<Controller
									name="buttonText"
									control={control}
									rules={{
										required: 'Текст кнопки обязателен',
										maxLength: { value: 200, message: 'Максимум 200 символов' },
									}}
									render={({ field }) => (
										<UITextField
											{...field}
											footerLabel="Введите текст для кнопки, которая будет видна в боте."
										/>
									)}
								/>
								{errors.buttonText && <Notice error>{errors.buttonText.message}</Notice>}
							</div>
						</SectionContainer>
						<SectionContainer hasBorder={false}>
							<div className='py-3 px-4'>
								<Controller
									name="buttonLink"
									control={control}
									rules={{
										required: 'Ссылка обязательна',
										maxLength: { value: 200, message: 'Максимум 200 символов' },
									}}
									render={({ field }) => (
										<UITextField
											{...field}
											footerLabel="Ссылка для кнопки."
										/>
									)}
								/>
								{errors.buttonLink && <Notice error>{errors.buttonLink.message}</Notice>}
							</div>
						</SectionContainer>
					</SectionContainer>
				</BlockContainer>

			</div>

			<MainContainerButton>
				<div className='flex w-full gap-2 flex-col small-screen:flex-row'>
					<UIButton
						variant="outline"
						onClick={onCancel}
						className='h-[56px]'
						type='button'
					>
						Отменить
					</UIButton>
					<UIButton
						variant="primary"
						position='center'
						disabledStyle='bg'
						isLoading={isLoading}
						className='h-[56px]'
						type='submit'
					>
						Сохранить
					</UIButton>
				</div>
			</MainContainerButton>
			<Modal isOpen={isOpen} onOpenChange={closeModal}>
				<ModalMessage onClick={closeModal} title='Ежедневный отчёт'>
					Текст, поясняющий как работает та или иная функция. Ссылка на{" "}
					<span className="text-tg-link cursor-pointer">инструкцию</span>.
				</ModalMessage>
			</Modal>
		</FormPageLayout>
	)
}


export default BotPrivetItemNew