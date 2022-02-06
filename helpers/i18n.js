import { I18nManager } from 'react-native';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

export const DEFAULT_LANGUAGE = 'fr';

export const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  fr: () => require('~/assets/translations/fr.json'),
  en: () => require('~/assets/translations/en.json'),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);
export const t = translate;

export const setI18nConfig = (codeLang = null) => {
  // fallback if no available language fits
  const fallback = { languageTag: DEFAULT_LANGUAGE, isRTL: false };
  const lang = codeLang ? { languageTag: codeLang, isRTL: false } : null;

  const { languageTag, isRTL } = lang || fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;

  return languageTag;
};
