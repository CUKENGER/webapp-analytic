import {
  $debug,
  backButton,
  initData,
  init as initSDK,
  miniApp,
  themeParams,
  viewport,
} from '@telegram-apps/sdk-react'

export function init(debug: boolean): void {
  $debug.set(debug)

  initSDK()

  // Add Eruda if needed.
  // debug && import('eruda')
  //   .then(lib => lib.default.init())
  //   .catch(console.error)

  // Check if all required components are supported.
  if (!backButton.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED')
  }

  // Mount all components used in the project.
  backButton.mount()
  miniApp.mount()
  // themeParams.mount()
  initData.restore()
  void viewport
    .mount()
    .catch((e) => {
      console.error('Something went wrong mounting the viewport', e)
    })
    .then(() => {
      // viewport.bindCssVars()
    })

  // Define components-related CSS variables.
  // miniApp.bindCssVars()
  // themeParams.bindCssVars()
}
