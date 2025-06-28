/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SERVER_ROOT: string
  // добавьте другие переменные окружения здесь
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
