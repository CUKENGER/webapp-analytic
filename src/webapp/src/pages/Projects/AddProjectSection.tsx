import { BlockTitle } from '@/components/@common/BlockTitle'
import { AddProjectBtn } from './AddProjectBtn'
import bot_icon from "@/assets/bot-icon.svg"
import channel_icon from "@/assets/channel-icon.svg"
import group_icon from "@/assets/group-icon.svg"
import { openTelegramLink, useLaunchParams, openLink } from '@telegram-apps/sdk-react'
import { useState } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { ModalMessage } from '@/components/@common/ModalMessage'
import { useNavigate } from 'react-router'
import { MainContainerButton } from '@/components/@common/MainContainerButton'

export const AddProjectSection = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [modalType, setModalType] = useState<'startchannel' | 'startgroup' | null>(null) // Храним тип

	const launchParams = useLaunchParams()
	const navigate = useNavigate()

	const botUsername = 'qwexs_ibot'
	const adminRights = 'invite_users+post_messages+delete_messages'

	const handleOpenLink = (type: 'startgroup' | 'startchannel') => {
		const tgLink = `tg://resolve?domain=${botUsername}&${type}&admin=${adminRights}`
		const webLink = `https://t.me/${botUsername}?${type}` // Fallback для веба

		if (launchParams?.platform) {
			if (launchParams.platform === 'macos') {
				setModalType(type)
				setIsOpen(true)
			} else {
				try {
					openTelegramLink(tgLink)
				} catch (err) {
					console.error('Ошибка Mini App:', err)
					window.open(webLink, '_blank')
				}
			}
		} else {
			window.open(webLink, '_blank')
		}
	}

	const { title, message } = getModalContent(modalType)

	return (
		<MainContainerButton>
			<BlockTitle title="Добавить проект">
				Подключите новый канал, группу или бота.
			</BlockTitle>
			<div className="flex justify-center w-full gap-2">
				<AddProjectBtn
					icon={channel_icon}
					onClick={() => handleOpenLink('startchannel')}
				>
					Канал
				</AddProjectBtn>
				<AddProjectBtn
					icon={group_icon}
					onClick={() => handleOpenLink('startgroup')}
				>
					Группа
				</AddProjectBtn>
				<AddProjectBtn
					icon={bot_icon}
					onClick={() => navigate('/projects/add/bot')}
				>
					Бот
				</AddProjectBtn>
			</div>
			<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
				<ModalMessage title={title} onClick={() => setIsOpen(false)}>
					<div className="flex w-full flex-col gap-2 text-start">{message}</div>
				</ModalMessage>
			</Modal>
		</MainContainerButton>
	)
}

// Функция для получения заголовка и текста в зависимости от типа
const getModalContent = (modalType: 'startchannel' | 'startgroup' | null) => {

	const handleClick = (link: string) => {
		openLink(link)
	}

	if (modalType === 'startchannel') {
		return {
			title: 'Подключение канала',
			message: (
				<>
					<p>К сожалению, кнопка «📢 Подключить канал» не работает на macOS.</p>
					<p>
						Чтобы подключить канал к сервису, вам нужно добавить бота @tgraphyx_bot вручную по{' '}
						<a
							className="text-tg-link cursor-pointer"
							onClick={() => handleClick("https://telegra.ph/Podklyuchenie-k-TeleGraphyx-12-02")}
						>
							инструкции
						</a>.
					</p>
				</>
			),
		}
	} else if (modalType === 'startgroup') {
		return {
			title: 'Подключение группы',
			message: (
				<>
					<p>К сожалению, кнопка «📢 Подключить группу» не работает на macOS.</p>
					<p>
						Чтобы подключить группу к сервису, вам нужно добавить бота @tgraphyx_bot вручную по{' '}
						<a
							className="text-tg-link cursor-pointer"
							onClick={() => handleClick("https://telegra.ph/Podklyuchenie-k-TeleGraphyx-12-02")}
						>
							инструкции
						</a>.
					</p>
				</>
			),
		}
	}
	return { title: '', message: null } // На случай ошибки
}