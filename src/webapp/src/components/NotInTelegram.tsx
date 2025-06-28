// NotInTelegram.tsx
import { FC } from 'react'

export const NotInTelegram: FC = () => {
  return (
    <div className="min-h-screen bg-tg-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-tg-background p-6 rounded-lg shadow-lg text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Авторизация в Telegram
        </h1>
        <p className="text-tg-hint">
          Вам нужно открыть это приложение через Telegram, чтобы продолжить.
          Пожалуйста, используйте ссылку от бота или авторизуйтесь в Telegram.
        </p>
        <a
          href="https://t.me/tgraphyx_bot" // Замените на реальную ссылку вашего бота
          className="inline-block px-6 w-full py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Открыть в Telegram
        </a>
      </div>
    </div>
  )
}
