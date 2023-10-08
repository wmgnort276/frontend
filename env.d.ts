/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VUE_APP_TITLE: string;
  readonly VUE_APP_DOMAIN_API: string;
  readonly VUE_APP_API_V1_URL: string;
  readonly VUE_APP_UPLOAD_FILE_API: string;
  readonly VUE_APP_FAQ_CODE_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
