import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronIcon } from '../icons/ChevronIcon';
import { CopyIcon } from '../icons/CopyIcon';
import { ReloadIcon } from '../icons/ReloadIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { BlockItem } from './BlockItem';


interface PropTypes {
  param: string
  value?: string
  needNotAvailable?: boolean
  needIcon?: boolean
  disabled?: boolean
  label?: string
  onClick?: () => void
  needCursorPointer?: boolean
  needColon?: boolean
  className?: string
  needHover?: boolean
  classNameBlock?: string
  classNameLabel?: string
}

export const BlockContentChevron = ({ needColon = true, param, value, needNotAvailable = true, needIcon = false, label, needCursorPointer = true, disabled = false, onClick, className, needHover = true, classNameBlock, classNameLabel }: PropTypes) => {
  return (
    <BlockItem className={cn('w-full', className)} needHover={needHover}>
      <div className={cn(
        "grid grid-cols-[auto,1fr,auto] items-center w-full pr-4",
        !disabled && needCursorPointer && 'cursor-pointer',
        disabled && 'text-tg-hint',
        classNameBlock
      )}
        aria-disabled={disabled}
        tabIndex={!disabled ? 0 : -1}
        role={needCursorPointer ? 'button' : ""}
        onClick={onClick}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            onClick?.()
          }
        }}
      >
        <span className="mr-1">{needColon ? `${param}:` : `${param}`}</span>
        <span className="font-bold truncate mr-2">
          {value ? value : needNotAvailable ? 'не доступен' : ''}
        </span>
        <div className='flex items-center gap-2'>
          {label && <span className={cn('text-tg-hint', classNameLabel)}>{label}</span>}
          {needIcon && (<ChevronIcon disabled={disabled} />)}
        </div>
      </div>
    </BlockItem>
  )
}

interface BlockContentSettingsProps {
  param: string
  value?: string
  disabled?: boolean
  reloadIcon?: boolean
  settingsIcon?: boolean
  onClick?: (() => void)
  needCursorPointer?: boolean
  customValue?: ReactNode
  needNotAvailable?: boolean
  needHover?: boolean
}

export const BlockContentSettings = ({ param, value, disabled, reloadIcon, settingsIcon, onClick, needCursorPointer = true, customValue, needNotAvailable, needHover = true }: BlockContentSettingsProps) => {
  return (
    <BlockItem className="w-full" needHover={needHover}>
      <div
        className={cn(
          'grid grid-cols-[auto,1fr,auto,auto] items-center w-full pr-4',
          disabled && 'text-tg-hint'
        )}
      >
        <span className="mr-1">{param}:</span>
        {customValue ? (
          customValue
        ) : needNotAvailable ? (
          <span className="font-bold truncate mr-2">не доступен</span>
        ) : (
          <span className="font-bold truncate mr-2">{value}</span>
        )}
        <div className="flex gap-2 items-center">
          {settingsIcon && !disabled && (
            <SettingsIcon
              className={cn('cursor-pointer')}
              onClick={!disabled && onClick ? onClick : undefined}
            />
          )}
          {reloadIcon && !disabled && (
            <ReloadIcon
              className="cursor-pointer"
              onClick={!disabled && onClick ? onClick : undefined}
            />
          )}
        </div>
      </div>
    </BlockItem>
  )
}

interface BlockContentCopyProps {
  param: string
  customValue?: ReactNode
  disabled?: boolean
  copyIcon?: boolean
  onIconClick?: () => void
}

export const BlockContentCopy = ({ param, customValue, disabled = false, copyIcon = true, onIconClick }: BlockContentCopyProps) => {
  return (
    <BlockItem className="w-full" needHover>
      <div
        className={cn(
          'grid grid-cols-[auto,1fr,auto] items-center w-full pr-4',
          disabled && 'text-tg-hint'
        )}
      >
        <span className="mr-2">{param}:</span>
        {customValue && customValue}
        {copyIcon && <CopyIcon onClick={onIconClick} />}
      </div>
    </BlockItem>
  )
}