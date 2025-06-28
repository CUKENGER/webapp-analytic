import { BlockTitle } from '@/components/@common/BlockTitle'
import { SectionContainer } from '../TariffControl/TariffItem'
import { UIInput } from '@/components/ui/UIInput'
import { BlockContainer } from '@/components/@common/BlockContainer'
import { Controller, useForm } from 'react-hook-form'
import { MainButtonBox } from '@/components/ui/MainButtonBox'
import { useState } from 'react'
import { Notice } from '@/components/@common/Notice'
import { Modal } from '@/components/Modal/Modal'
import { useModal } from '@/hooks/useModal'
import { useNavigate, useParams } from 'react-router'
import { UIButton } from '@/components/ui/UIButton'
import { ModalContent, ModalFooter, ModalHeader, ModalMain } from '@/components/@common/ModalContent'
import { useToast } from '@/hooks/use-toast'
import { FormPageLayout } from '@/atoms/FormPageLayout'
import { SectionTitle } from '@/components/@common/SectionTitle'
import { PATHS } from '@/components/utils/paths'
import { usePopState } from '@/hooks/usePopState'

type FormData = {
	username: string
}

const AccessFindUser = () => {

	const { id } = useParams()

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			username: '',
		},
	})

	usePopState(PATHS.projects.accesses.root(id ?? '/'))

	const [isLoading, setIsLoading] = useState(false)
	const [serverErrors, setServerErrors] = useState<string[]>([]) // Для серверных ошибок

	const { isOpen, openModal, closeModal, modalType } = useModal()
	const navigate = useNavigate()
	const { toast } = useToast()

	// Список существующих пользователей (берем из предыдущей страницы)
	const existingUsers = [
		'user1',
		'user2',
		'user3',
		'user4',
		'admin', // Предположим, это администратор
	]

	const onSubmit = (data: FormData) => {
		setServerErrors([]) // Очищаем предыдущие серверные ошибки

		// Нормализуем имя пользователя
		let username = data.username.trim()
		if (username.startsWith('@')) {
			username = username.slice(1)
		} else if (username.startsWith('https://t.me/')) {
			username = username.replace('https://t.me/', '')
		}

		// Проверки перед открытием модального окна
		const newServerErrors: string[] = []
		if (existingUsers.includes(username)) {
			newServerErrors.push(`У пользователя @${username} уже есть доступ.`)
		}
		if (username === 'admin') {
			newServerErrors.push('Администратор канала не может выдавать доступ себе.')
		}
		if (username === 'notfound') {
			newServerErrors.push(
				`Пользователь @${username} не найден. Он должен запустить бота @tgraphyx_bot.`
			)
		}

		if (newServerErrors.length > 0) {
			setServerErrors(newServerErrors)
			return
		}

		// Если ошибок нет, открываем модальное окно для подтверждения
		openModal(username)
	}

	const handleConfirm = () => {
		setIsLoading(true)

		// Симуляция запроса
		setTimeout(() => {
			console.log(`Доступ выдан для @${modalType}`)
			setIsLoading(false)
			closeModal()
			toast({
				description: "Доступ успешно выдан"
			})
			navigate(`/projects/${id}/accesses`) // Возвращаемся на предыдущую страницу после успеха
		}, 2000)
	}

	const handleCancel = () => {
		closeModal()
		navigate(`${PATHS.projects.accesses.root(id ?? '')}`)
	}

	return (
		<FormPageLayout className='bg-tg-secondary' onSubmit={handleSubmit(onSubmit)} >
			<BlockTitle title="Доступы">
				Добавьте пользователя
			</BlockTitle>
			<BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
				<SectionTitle title='Имя пользователя'/>
				<SectionContainer hasBorder={false}>
					<div className='px-4 py-3 flex flex-col w-full gap-2'>
						<Controller
							name="username"
							control={control}
							rules={{
								required: 'Имя пользователя обязательно',
								pattern: {
									value: /^(@[A-Za-z0-9_]{5,}|https:\/\/t\.me\/[A-Za-z0-9_]{5,})$/,
									message: 'Введено некорректное имя пользователя.',
								},
							}}
							render={({ field }) => (
								<UIInput
									placeholder="Имя пользователя..."
									{...field}
									className={errors.username ? 'border-red-500' : ''}
								/>
							)}
						/>
						{/* Клиентские ошибки */}
						{errors.username && (
							<Notice error>{errors.username.message}</Notice>
						)}
						{/* Серверные ошибки */}
						{serverErrors.length > 0 && (
							<div className="flex flex-col gap-2">
								{serverErrors.map((error, index) => (
									<Notice key={index} error>{error}</Notice>
								))}
							</div>
						)}
						<p className='text-start text-sm text-gray'>
							Введите имя пользователя в формате{` `}
							<span className='text-tg-text'>
								@username{` `}
							</span>
							или{` `}
							<span className='text-tg-text'>
								https://t.me/username
							</span>.
						</p>
					</div>
				</SectionContainer>
			</BlockContainer>
			<MainButtonBox type='submit'>
				Выдать доступ
			</MainButtonBox>

			<Modal isOpen={isOpen} onOpenChange={closeModal}>
				<ModalContent>
					<ModalHeader>
						Выдать доступ пользователю:
					</ModalHeader>
					<ModalMain>
						<div className='flex w-full flex-col gap-2'>
							<span>@{modalType}</span>
							<p className='text-gray text-sm'>
								Вы действительно хотите выдать доступ этому пользователю?
							</p>
						</div>
					</ModalMain>
					<ModalFooter>
						<UIButton
							className="h-[38px] text-tg-destructive"
							variant="outline"
							shadow="none"
							fontSize="sm"
							rounded="lg"
							size="sm"
							position="center"
							onClick={handleCancel}
						>
							Отменить
						</UIButton>
						<UIButton
							className="h-[38px]"
							variant="primary"
							shadow="none"
							fontSize="sm"
							rounded="lg"
							size="forLoading"
							position="center"
							isLoading={isLoading}
							onClick={handleConfirm}
						>
							Выдать
						</UIButton>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</FormPageLayout >
	)
}

export default AccessFindUser
