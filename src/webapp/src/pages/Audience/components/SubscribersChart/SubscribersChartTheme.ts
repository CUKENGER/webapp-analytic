export const SubscribersChartTheme = {
  background: 'var(--tg-bg-color)',
  text: { fill: 'var(--tg-text-color)', fontFamily: 'manrope' },
  labels: {
    text: { fill: 'var(--tg-text-color)', fontFamily: 'manrope' }
  },
  axis: {
    domain: {
      line: {
        stroke: 'var(--tg-border-color)'
      }
    },
    ticks: {
      line: {
        stroke: 'var(--tg-border-color)'
      },
      text: {
        fontSize: 12,
        fill: 'var(--tg-hint-color)'
      }
    }
  },
  grid: {
    line: {
      stroke: 'var(--tg-border-color)',
    }
  },
  crosshair: {
    line: {
      stroke: 'var(--tg-hint-color)',
      strokeWidth: 1,
      strokeOpacity: 0.5
    }
  }
}
