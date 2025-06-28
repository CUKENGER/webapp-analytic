import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
import { Root } from './components/Root'
import { init } from './init'
import '@twa-dev/sdk'
import './index.css'
import './mockEnv'
import { ThemeProvider } from '@/components/theme-provider'

try {
  init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)
} catch (e) {
  console.error(e)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </StrictMode>
)
