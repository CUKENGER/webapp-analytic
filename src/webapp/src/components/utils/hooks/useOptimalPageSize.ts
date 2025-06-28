;
// src/hooks/useOptimalPageSize.ts
import { useLayoutEffect, useState } from 'react';


interface PageSizeOptions {
  rowHeight?: number;
  headerHeight?: number;
  footerHeight?: number;
  buffer?: number;
  minPageSize?: number;
}

/**
 * Хук для расчета оптимального размера страницы на основе высоты видимой области
 * @param options Параметры для расчета
 * @returns Оптимальный размер страницы
 */
export function useOptimalPageSize({
  rowHeight = 41,           // Примерная высота строки таблицы
  headerHeight = 50,        // Примерная высота заголовка таблицы
  footerHeight = 40,        // Примерная высота футера/индикатора загрузки
  buffer = 1.5,             // Буфер (коэффициент) для предзагрузки
  minPageSize = 15          // Минимальный размер страницы
}: PageSizeOptions = {}) {
  const [pageSize, setPageSize] = useState(minPageSize);

  useLayoutEffect(() => {
    const calculateOptimalPageSize = () => {
      const viewportHeight = window.innerHeight;

      // Доступная высота для строк таблицы
      const availableHeight = viewportHeight - headerHeight - footerHeight;

      // Количество строк, которые поместятся в видимой области
      const visibleRowsCount = Math.ceil(availableHeight / rowHeight);

      // Добавляем буфер для предварительной загрузки
      const optimalPageSize = Math.ceil(visibleRowsCount * buffer);

      return Math.max(minPageSize, optimalPageSize);
    };

    setPageSize(calculateOptimalPageSize());
  }, []); // Выполняется только при монтировании

  return pageSize;
}
