import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PageLayout } from '@/atoms/PageLayout'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { ButtonUserCard } from '@/components/@common/ButtonUserCard'
import { Modal } from '@/components/Modal/Modal'
import { MainButtonBox } from '@/components/ui/MainButtonBox'
import { UIButton } from '@/components/ui/UIButton'
import { useModal } from '@/hooks/useModal'

const initialUsers = [
  { name: 'user1', date: '22.12.2024' },
  { name: 'user2', date: '18.12.2024' },
  { name: 'user3', date: '10.09.2024' },
  { name: 'user4', date: '22.05.2024' }
]

const AccessControl = () => {
  const { id } = useParams()
  const [users, setUsers] = useState(initialUsers)
  const [isLoading, setIsLoading] = useState(false)

  const { isOpen, openModal, closeModal, modalType } = useModal()
  const navigate = useNavigate()

  // Обработчик удаления с задержкой 500мс
  const handleCrossClick = (username: string) => {
    openModal(username)
  }

  const handleConfirm = () => {
    setIsLoading(true)
    setTimeout(() => {
      setUsers(prevUsers => prevUsers.filter(user => user.name !== modalType))
      setIsLoading(false)
      closeModal()
    }, 2000)
  }

  return (
    <PageLayout>
      <BlockTitle title="Доступы">
        Выдайте доступ к сервису для других пользователей.
      </BlockTitle>
      <div className="flex w-full flex-col gap-2">
        {users.map((item, index) => (
          <ButtonUserCard
            key={index}
            name={item.name}
            onCrossClick={() => handleCrossClick(item.name)}
          >
            <span>{item.date}</span>
          </ButtonUserCard>
        ))}
      </div>
      <MainButtonBox onClick={() => navigate('find')}>
        Выдать доступ
      </MainButtonBox>
      <Modal isOpen={isOpen} onOpenChange={closeModal}>
        <div>
          <div className="border-b border-0 border-gray-stroke text-start">
            <p className="text-base font-bold px-4 py-3 text-tg-text">
              Закрыть доступ пользователю:
            </p>
          </div>
          <div className="text-start border-b border-gray-stroke">
            <p className="px-4 py-3 text-tg-text flex flex-col gap-2">
              <span>@{modalType}</span>
              <p className="text-gray text-sm">
                Вы действительно хотите закрыть доступ этому пользователю?
              </p>
            </p>
          </div>
          <div className="px-4 py-3 flex w-full gap-2 bottom-bar-shadow">
            <UIButton
              className="h-[38px] text-tg-destructive"
              variant="outline"
              shadow="none"
              fontSize="sm"
              rounded="lg"
              size="sm"
              position="center"
              onClick={closeModal}
            >
              Отменить
            </UIButton>
            <UIButton
              className="h-[38px]"
              variant="outline"
              shadow="none"
              fontSize="sm"
              rounded="lg"
              size="forLoading"
              position="center"
              colorText="red"
              isLoading={isLoading}
              onClick={handleConfirm}
            >
              Закрыть
            </UIButton>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}

export default AccessControl
