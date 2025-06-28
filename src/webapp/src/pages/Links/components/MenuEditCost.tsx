import { FC, useCallback, useEffect, useState } from 'react'
import { Spinner } from '@telegram-apps/telegram-ui'
import _ from 'lodash'
import { useEditInviteLinkCost } from '@/api/hooks/useEditInviteLinkCost'
import edit_icon from '@/assets/edit-icon.svg'
import { EditIcon } from '@/components/icons/EditIcon'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { Input } from '@/components/ui/input'
import { useKeyboardOffset } from '@/hooks/useKeyboardOffset'
import { cn } from '@/lib/utils'

type PropTypes = {
  id?: string
  value: string
  source?: 'custom' | 'channel'
  disabled?: boolean
}

const MenuEditCost: FC<PropTypes> = ({
  id,
  source,
  value = '',
  disabled = false
}) => {
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(value)

  const { mutate, isSuccess, isPending } = useEditInviteLinkCost()

  const { keyBoardOffset } = useKeyboardOffset()

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--keyboardup',
      `${keyBoardOffset}px`
    )
  }, [keyBoardOffset])

  useEffect(() => {
    if (isSuccess) {
      toggleDropdown(false)
    }
  }, [isSuccess])

  const toggleDropdown = (value: boolean) => {
    if (disabled) return
    setActiveDropdown(value)
  }

  const handleSubmit = useCallback(() => {
    if (id && source) {
      mutate({ id, cost: inputValue, source })
    }
  }, [inputValue, id, source, mutate])

  return (
    <DropdownMenu
      side="center"
      className="p-0 bg-tg-background-none"
      isOpen={activeDropdown === true}
      onOpenChange={() => toggleDropdown(!activeDropdown)}
      icon={<EditIcon className={cn(disabled && 'opacity-50')} />}
      disabled={disabled}
    >
      <div className="p-4 space-y-4 rounded-2xl">
        <div className="h-full flex flex-col justify-between gap-5 pb-6">
          <div className="w-full mx-auto space-y-1 rounded-md shadow-md bg-tg-bg items-center gap-4 px-2 pt-2 pb-1">
            <Input
              type="number"
              id="myInput"
              placeholder="Введите расход, ₽"
              value={inputValue === '0' ? '' : inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 text-base font-medium bg-transparent border-none outline-hidden placeholder:text-tg-hint placeholder:text-base placeholder:font-medium focus-visible:ring-0"
            />
          </div>
          <button
            disabled={!inputValue}
            className="w-full h-[56px] px-5 bg-tg-link text-white-text rounded-2xl font-bold hover:opacity-90 disabled:opacity-50"
            type="submit"
            onClick={handleSubmit}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Spinner className="flex m-auto" size="m" />
              </div>
            ) : (
              'Сохранить'
            )}
          </button>
        </div>
      </div>
    </DropdownMenu>
  )
}

export default MenuEditCost
