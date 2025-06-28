export const CustomChangesLayer = (props: any) => {
  const { bars, yScale, selectedDays, colors, visibleLayers } = props
  const zeroY = yScale(0) // Без Math.round

  return bars.map((bar: any) => {
    const { data, x, width } = bar
    const barWidth = 8
    const centerX = Math.round(x + width / 2)
    const adjustedX = centerX - barWidth / 2

    const subscriptionHeight = Math.abs(yScale(data.data.subscriptions) - zeroY)
    const subscriptionY =
      data.data.subscriptions >= 0 ? zeroY - subscriptionHeight : zeroY
    const subscriptionBorderRadius = Math.min(2, subscriptionHeight / 2) // Пропорционально высоте

    const unsubscriptionHeight = Math.abs(yScale(data.data.unsubscriptions) - zeroY)
    const unsubscriptionY =
      data.data.unsubscriptions >= 0 ? zeroY - unsubscriptionHeight : zeroY
    const unsubscriptionBorderRadius = Math.min(2, unsubscriptionHeight / 2) // Пропорционально высоте

    const isSelected = selectedDays.includes(data.data.day)
    const opacity = selectedDays.length === 0 || isSelected ? 1 : 0.5

    return (
      <g key={`${bar.key}-changes`}>
        {visibleLayers.subscriptions && data.data.subscriptions !== 0 && (
          <path
            d={`
              M ${adjustedX + subscriptionBorderRadius} ${subscriptionY}
              H ${adjustedX + barWidth - subscriptionBorderRadius}
              Q ${adjustedX + barWidth} ${subscriptionY} ${adjustedX + barWidth
              } ${subscriptionY + subscriptionBorderRadius}
              V ${subscriptionY + subscriptionHeight}
              H ${adjustedX}
              V ${subscriptionY + subscriptionBorderRadius}
              Q ${adjustedX} ${subscriptionY} ${adjustedX + subscriptionBorderRadius} ${subscriptionY}
              Z
            `}
            fill={colors.subscriptions}
            opacity={opacity}
          />
        )}
        {visibleLayers.unsubscriptions && data.data.unsubscriptions !== 0 && (
          <path
            d={`
              M ${adjustedX} ${unsubscriptionY} 
              H ${adjustedX + barWidth} 
              V ${unsubscriptionY + unsubscriptionHeight - unsubscriptionBorderRadius} 
              Q ${adjustedX + barWidth} ${unsubscriptionY + unsubscriptionHeight} ${adjustedX + barWidth - unsubscriptionBorderRadius
              } ${unsubscriptionY + unsubscriptionHeight}
              H ${adjustedX + unsubscriptionBorderRadius} 
              Q ${adjustedX} ${unsubscriptionY + unsubscriptionHeight} ${adjustedX} ${unsubscriptionY + unsubscriptionHeight - unsubscriptionBorderRadius
              } 
              Z
            `}
            fill={colors.unsubscriptions}
            opacity={opacity}
          />
        )}
      </g>
    )
  })
}
