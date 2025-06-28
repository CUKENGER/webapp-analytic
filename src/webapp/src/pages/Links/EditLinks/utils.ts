// Вспомогательные функции
const FIXED_PERIODS = [0, 3600, 86400, 604800];
const TOLERANCE = 60; // Допустимая погрешность в секундах (например, 1 минута)\

export const getUserLimitValue = (memberLimit: number | null): string =>
  !memberLimit ? 'user_limit_0' : [1, 10, 100].includes(memberLimit) ? String(memberLimit) : 'other_users'

export const getCustomUserLimitValue = (memberLimit: number | null): number | null =>
  !memberLimit || [0, 1, 10, 100].includes(memberLimit) ? null : memberLimit

export const getPeriodValue = (expireDate: number | null): string => {
  if (!expireDate) return 'period_0';

  const now = Math.floor(Date.now() / 1000);
  const diff = expireDate - now;

  // Если дата в будущем, проверяем фиксированные периоды
  if (diff > 0) {
    for (const period of FIXED_PERIODS) {
      if (period !== 0 && Math.abs(diff - period) <= TOLERANCE) {
        return String(period);
      }
    }
    return 'other_period'; // Любое будущее время, не соответствующее фиксированным периодам
  }
  return 'period_0'; // Если время истекло
};

export const getCustomPeriodValue = (expireDate: number | null): number | null => {
  if (!expireDate) return null;

  const now = Math.floor(Date.now() / 1000);
  const diff = expireDate - now;

  // Если дата в будущем и не соответствует фиксированным периодам, это пользовательская дата
  if (diff > 0) {
    for (const period of FIXED_PERIODS) {
      if (period !== 0 && Math.abs(diff - period) <= TOLERANCE) {
        return null;
      }
    }
    return expireDate;
  }
  return null; // Если время истекло
};