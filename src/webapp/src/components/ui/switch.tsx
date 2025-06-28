import * as React from 'react';
import { useState } from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import { InfoIcon } from '../icons/InfoIcon';


interface CustomSwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string
  tooltip?: React.ReactNode
  tooltipOnClick?: () => void
}

const CustomSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  CustomSwitchProps
>(({ className, label, tooltip, tooltipOnClick, ...props }, ref) => {
  const [open, setOpen] = useState(false)
  return (
    <Tooltip.Provider>
      <div className="flex items-center justify-between w-full gap-2 pr-4">
        {label && (
          <div className="flex items-center gap-2"
            style={{ maxWidth: 'calc(100% - 62px)' }}
          >
            <span
              className="whitespace-nowrap text-tg-text truncate overflow-hidden text-ellipsis block"
            >
              {label}
            </span>
            {tooltipOnClick && (
              <span onClick={tooltipOnClick}>
                <InfoIcon />
              </span>
            )}
            {tooltip && (
              <Tooltip.Root open={open} onOpenChange={setOpen}>
                <Tooltip.Trigger
                  asChild
                  onClick={() => {
                    setOpen(!open)
                  }}
                >
                  <span>
                    <InfoIcon />
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className="max-w-xs p-2 text-sm rounded shadow bg-tg-background">
                    {tooltip}
                    <Tooltip.Arrow className="fill-tg-background" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            )}
          </div>
        )}
        <SwitchPrimitives.Root
          className={cn(
            'peer inline-flex h-[30px] w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
            'transition-colors focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-tg-hint focus-visible:ring-offset-2 focus-visible:ring-offset-tg-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:bg-tg-primary data-[state=unchecked]:bg-gray-stroke',
            className
          )}
          {...props}
          ref={ref}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              'pointer-events-none block size-[26px] rounded-full bg-white',
              'shadow-[0_2px_4px_rgba(38,40,45,0.2)] transition-transform',
              'data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0'
            )}
          />
        </SwitchPrimitives.Root>
      </div>
    </Tooltip.Provider>
  )
})

CustomSwitch.displayName = SwitchPrimitives.Root.displayName

export { CustomSwitch }