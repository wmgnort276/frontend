import { createI18n, type I18nOptions } from 'vue-i18n';

function loadLangFile(lang = 'en') {
  let data: Record<string, any> = {};
  Object.entries(import.meta.glob('../locales/**/*.y(a)?ml', { eager: true })).map(
    ([key, value]: any) => {
      const arrKey = key.split('/');
      const fileName = arrKey.at(-1).split('.')[0];
      if (arrKey[2] === lang) {
        data = { ...data, ...{ [fileName]: value.default } };
      }
    }
  );
  return data;
}

export const localesConfigs = {
  ja: {
    ...loadLangFile('ja')
  }
} as I18nOptions['messages'];

export const i18n = createI18n({
  locale: 'ja',
  legacy: false,
  fallbackLocale: 'ja',
  messages: localesConfigs
});

export const { t } = i18n.global;
export default i18n;
