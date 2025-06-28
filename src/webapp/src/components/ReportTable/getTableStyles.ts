// Константы
const TABLE_CONSTANTS = {
  ROW_HEIGHT: 36,
  OVERSCAN: 20,
  SIDE_PADDING: 16,
  HEADER_FOOTER_HEIGHT: 4
}

export const getTableStyles = (
  tableWidth: number,
  isWideScreen: boolean,
  containerWidth,
) => {

  return {
    container: { width: tableWidth, minWidth: '100%' },
    side: {
      width: TABLE_CONSTANTS.SIDE_PADDING,
      flexShrink: 0,
      height: 'auto'
    },
    footer: {
      width: tableWidth,
      minWidth: isWideScreen ? containerWidth : 'auto',
    }, // Убираем footerWidth, используем tableWidth напрямую
    rightWork: {
      width: TABLE_CONSTANTS.SIDE_PADDING,
      flexShrink: 0,
      height: 'auto'
    },
    marginRightBlock: {
      width: isWideScreen ? 0 : TABLE_CONSTANTS.SIDE_PADDING,
      flexShrink: 0,
      height: 'auto'
    },
    tableInnerWidth: {
      // Добавляем стиль для самой таблицы
      minWidth: tableWidth // Минимальная ширина таблицы равна вычисленной ширине
    },
  }
}
