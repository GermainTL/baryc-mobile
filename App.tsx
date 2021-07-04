import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Notification from "~/components/Notification.tsx";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import * as i18n from '~/helpers/i18n.js';
import LocalizationContext from '~/context/LocalizationContext.js';
import { Provider } from 'react-redux'
import Store from '~/store/createStore.tsx'

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [locale, setLocale] = React.useState(i18n.DEFAULT_LANGUAGE);

  const localizationContext = React.useMemo(
      () => ({
        t: (scope, options) => i18n.t(scope, {locale, ...options}),
        locale,
        setLocale,
      }),
      [locale],
  );

  const handleLocalizationChange = useCallback(
    (newLocale) => {
        const newSetLocale = i18n.setI18nConfig(newLocale);
        setLocale(newSetLocale);
    },
    [locale],
    );

  useEffect(() => {
    handleLocalizationChange();

    return () => {
    };
  }, []);

  if (isLoadingComplete) {
    return (
        <Provider store={Store}>
          <LocalizationContext.Provider value={localizationContext}>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme}/>
              <StatusBar/>
              <Notification />
            </SafeAreaProvider>
          </LocalizationContext.Provider>
        </Provider>
    );
  } else {
    return null;
  }
}
