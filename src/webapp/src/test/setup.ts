import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Очищаем DOM после каждого теста
afterEach(() => {
  cleanup()
})

// Настраиваем базовый URL для jsdom
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost',
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost'
  },
  writable: true
})

console.log('Setup: mocking global.fetch')
// Мокаем global.fetch с явной типизацией
global.fetch = vi.fn()

// Проверяем, что fetch остаётся замоканным
beforeEach(() => {
  if (!(global.fetch as any).mock) {
    console.error('global.fetch is not a Vitest mock')
    global.fetch = vi.fn()
  }
})
