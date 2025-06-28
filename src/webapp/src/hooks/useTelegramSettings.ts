import { defineEventHandlers } from '@telegram-apps/sdk'
import {
  backButton,
  disableVerticalSwipes,
  postEvent,
  swipeBehavior
} from '@telegram-apps/sdk-react'
import { useCallback } from 'react'

export const useTelegramSettings = (isTelegram: boolean, theme: string) => {

  const initTelegram = useCallback(async () => {
    if (isTelegram) {
      defineEventHandlers()
      postEvent('web_app_ready')
      postEvent('web_app_expand')
      postEvent('web_app_setup_closing_behavior', { need_confirmation: true })
      postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false })
      postEvent('web_app_setup_settings_button', { is_visible: true })
      // if (theme === 'dark') {
      //   postEvent('web_app_set_header_color', {
      //     color: '#26282D'
      //   })
      //   postEvent('web_app_set_bottom_bar_color', {
      //     color: '#26282D',
      //   })
      // }
      //   type: 'impact',
      //   impact_style: 'light'
      // })
      postEvent('web_app_check_home_screen')
      // postEvent('web_app_add_to_home_screen')
      // const lgdfg = on('settings_button_pressed', payload => {
      //   console.log('payload', payload)
      // })

      // Кнопки
      // postEvent('web_app_setup_main_button', {
      //   color: '#0080FF',
      //   is_visible: true,
      //   is_active: true,
      //   has_shine_effect: true,
      //   text: 'Подтвердить',
      //   text_color: '#FFFFFF',
      // })
      // postEvent('web_app_setup_secondary_button', {
      //   is_visible: true,
      //   is_active: true,
      //   has_shine_effect: true,
      //   text: 'Отменить',
      //   text_color: '#0080FF',
      //   color: '#FFFFFF',
      //   position: 'left'
      // })

      if (swipeBehavior.isMounted()) {
        disableVerticalSwipes()
      }

      return () => {
        if (backButton) {
          backButton.hide()
        }
      }
    }
  }, [isTelegram, theme])

  return {
    initTelegram
  }
}
