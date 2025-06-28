const red = { r: 255, g: 64, b: 0, a: 1 }
const orange = { r: 255, g: 160, b: 0, a: 1 }
const yellow = { r: 255, g: 224, b: 0, a: 1 }
const green = { r: 170, g: 204, b: 0, a: 1 }

export function getGradientColor(
  value: number,
  maxValue: number,
  direction: number = 1
): string {
  if (value < 0) value = 0
  if (value > maxValue) value = maxValue

  let percentage = maxValue === 0 ? 0 : (value / maxValue) * 100
  if (direction === -1) {
    percentage = 100 - percentage
  }

  let color
  if (percentage <= 33.33) {
    // От красного к оранжевому (0-33.33%)
    const ratio = percentage / 33.33
    color = interpolateColor(red, orange, ratio)
  } else if (percentage <= 66.66) {
    // От оранжевого к желтому (33.33-66.66%)
    const ratio = (percentage - 33.33) / 33.33
    color = interpolateColor(orange, yellow, ratio)
  } else {
    // От желтого к зеленому (66.66-100%)
    const ratio = (percentage - 66.66) / 33.34
    color = interpolateColor(yellow, green, ratio)
  }

  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
}

function interpolateColor(
  color1: { r: number; g: number; b: number; a: number },
  color2: { r: number; g: number; b: number; a: number },
  ratio: number
) {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * ratio),
    g: Math.round(color1.g + (color2.g - color1.g) * ratio),
    b: Math.round(color1.b + (color2.b - color1.b) * ratio),
    a: color1.a + (color2.a - color1.a) * ratio
  }
}
