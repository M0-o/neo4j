/// <reference types="vite/client" />

export interface ImportMetaEnv {
  readonly MAIN_VITE_NEO4J_URI: string
  readonly MAIN_VITE_NEO4J_USER: string
  readonly MAIN_VITE_NEO4J_PASSWORD: string
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}
