// Общие параметры для приглашений
export interface InviteLinkParams {
  /** Название инвайта */
  name?: string | null
  /** Требовать одобрения запроса на вступление */
  creates_join_request?: boolean
  /** Срок действия в секундах (будет добавлен к текущему времени) */
  expire_date?: number
  /** Максимальное число участников */
  member_limit?: number | null
  /** Расход инвайта */
  cost?: number
}

// Параметры для создания инвайта
export interface CreateInviteLinkRequest extends InviteLinkParams {
  /** UUID канала */
  channelUUID: string
}

// Параметры для редактирования инвайта
export interface EditInviteLinkRequest extends InviteLinkParams {
}

export interface EditCostRequest {
  source: 'custom' | 'channel'
  cost: number
}

export interface EditCostResponse {
  id: number
  cost: string
}

// Ответ при создании или редактировании инвайта
export interface InviteLinkResponse {
  id: number
  createdAtEpoch: number
  invite_link: string
  name: string | null
  creates_join_request: boolean
  is_primary: boolean
  is_revoked: boolean
  expire_date: number | null
  member_limit: number | null
  cost: string
}

// Ответ от API Telegram, обогащенный полем statusCode для обработки ошибок
export interface TelegramInviteLinkResponse {
  statusCode?: number
  message?: string
  invite_link?: string
  creates_join_request?: boolean
  is_primary?: boolean
  is_revoked?: boolean
  name?: string | null
  expire_date?: number | null
  member_limit?: number | null
}
