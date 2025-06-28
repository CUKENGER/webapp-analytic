import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'
import { Input } from './input'
import { RadioIcon } from '../icons/RadioIcon'

type RadioOption = {
  value: string
  label: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  customElement?: React.ReactNode
}

interface CustomRadioGroupProps {
  options: RadioOption[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  onInputChange?: (value: string) => void
  inputValue?: number | string
  className?: string
  showInput?: boolean
  classNameOption?: string
}

export const CustomRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  CustomRadioGroupProps
>(
  (
    {
      options,
      className,
      defaultValue,
      value,
      onChange,
      onInputChange,
      inputValue,
      showInput,
      classNameOption,
      ...props
    },
    ref
  ) => {
    return (
      <RadioGroupPrimitive.Root
        className={cn('flex flex-col', className)}
        defaultValue={defaultValue}
        value={value}
        onValueChange={onChange}
        {...props}
        ref={ref}
      >
        {options.map((option, index) => (
          <React.Fragment key={option.value}>
            <RadioOptionItem
              option={option}
              isSelected={value === option.value}
              showInput={showInput}
              inputValue={inputValue}
              onInputChange={onInputChange}
              classNameOption={classNameOption}
            />
            {index < options.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </RadioGroupPrimitive.Root>
    )
  }
)

CustomRadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioOptionItem: React.FC<{
  option: RadioOption
  isSelected: boolean
  showInput?: boolean
  inputValue?: string | number
  classNameOption?: string
  onInputChange?: (value: string) => void
}> = ({ option, isSelected, showInput, inputValue, onInputChange, classNameOption }) => (
  <label
    htmlFor={option.value}
    className={cn("flex items-center justify-between w-full cursor-pointer select-none text-tg-text gap-2 h-[46px] block-item--hover", classNameOption)}
  >
    <span className="flex-shrink-0">{option.label}</span>
    {isSelected && showInput && option.inputProps && (
      <InputField
        inputProps={option.inputProps}
        inputValue={inputValue}
        onInputChange={onInputChange}
      />
    )}
    {isSelected && showInput && !option.inputProps && option.customElement && option.customElement}
    <RadioGroupItem value={option.value} id={option.value} isSelected={isSelected} />
  </label>
)

const InputField: React.FC<{
  inputProps: RadioOption['inputProps']
  inputValue?: number | string
  onInputChange?: (value: string) => void
}> = ({ inputProps, inputValue, onInputChange }) => (
  <Input
    type={inputProps?.type || 'text'}
    placeholder={inputProps?.placeholder}
    min={inputProps?.min}
    max={inputProps?.max}
    value={inputValue}
    onChange={e => onInputChange?.(e.target.value)}
    className={cn(
      'w-full px-0 py-0 h-[24px] rounded-lg outline-none bg-tg-background text-end',
      'text-tg-link font-bold focus-visible:outline-hidden',
      '[appearance:textField]',
      '[&::-webkit-outer-spin-button]:appearance-none',
      '[&::-webkit-inner-spin-button]:appearance-none',
      'focus:ring-0 focus-visible:ring-0',
      'transition-colors duration-200 border-none border-b border-gray-stroke'
    )}
  />
)

const Divider: React.FC = () => <div className="w-full h-px bg-gray-stroke" />

interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  isSelected?: boolean // Добавляем isSelected как опциональный boolean
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps // Используем новый интерфейс
>(({ className, isSelected, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'size-5 bg-transparent cursor-pointer flex-shrink-0',
        'focus:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {isSelected ? (<RadioIcon checked={true} />) : (<RadioIcon checked={false} />)}
    </RadioGroupPrimitive.Item>
  )
})

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName
