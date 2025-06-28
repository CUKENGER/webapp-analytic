import { UIButton } from './UIButton'

export const DropdownButtons = ({
  disabled,
  handleCancel,
  handleConfirm
}: {
  disabled?: boolean
  handleCancel: () => void
  handleConfirm: () => void
}) => {
  return (
    <div className="w-full items-center h-bottom-btn bg-tg-bg-color border-light-gray-stroke border-t flex gap-2 px-4 py-3">
      <UIButton
        className="h-[38px]"
        variant="outline"
        rounded='lg'
        fontSize='sm'
        position='center'
        size='sm'
        onClick={e => {
          e.preventDefault()
          handleCancel()
        }}
        type="button"
      >
        Отменить
      </UIButton>
      <UIButton
        onClick={e => {
          e.preventDefault()
          handleConfirm()
        }}
        className="h-[38px]"
        disabled={disabled}
        type="button"
        variant='primary'
        shadow='none'
        fontSize='sm'
        rounded='lg'
        size='sm'
        position='center'
      >
        Подтвердить
      </UIButton>
    </div>
  )
}
