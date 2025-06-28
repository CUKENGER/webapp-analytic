import { BarItemProps } from '@nivo/bar'
import { AudienceChartLayers } from '../../AudiencePage'

interface CustomBarProps
  extends BarItemProps<{
    day: string
    unsubscriptions: number
    subscriptions: number
    total: number
  }> {
  selectedDays: string[]
  visibleLayers: AudienceChartLayers
}

export const CustomBar = ({
  bar,
  selectedDays,
  visibleLayers
}: CustomBarProps) => {
  const { x, y, width, height, color, data } = bar
  const barWidth = 8
  const centerX = Math.round(x + width / 2)
  const adjustedX = centerX - barWidth / 2
  const adjustedHeight = Math.abs(height)
  const adjustedY = height < 0 ? y + height : y
  const borderRadius = 2

  if (
    isNaN(x) ||
    isNaN(y) ||
    isNaN(width) ||
    isNaN(adjustedHeight) ||
    !isFinite(width)
  ) {
    console.warn('Invalid bar values:', { x, y, width, height })
    return null
  }

  const isSelected = selectedDays.includes(data.data.day)
  const opacity = selectedDays.length === 0 || isSelected ? 1 : 0.5

  if (!visibleLayers.total) {
    return null
  }

  return (
    <path
      d={`
        M ${adjustedX + borderRadius} ${adjustedY}
        H ${adjustedX + barWidth - borderRadius}
        Q ${adjustedX + barWidth} ${adjustedY} ${adjustedX + barWidth} ${
          adjustedY + borderRadius
        }
        V ${adjustedY + adjustedHeight}
        H ${adjustedX}
        V ${adjustedY + borderRadius}
        Q ${adjustedX} ${adjustedY} ${adjustedX + borderRadius} ${adjustedY}
        Z
      `}
      fill={color}
      opacity={opacity}
    />
  )
}
