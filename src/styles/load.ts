// load theme from localStorage and system
import { darkMode, lightMode } from './colors';

function setThemeMeta(isDark: boolean) {
  if (typeof window === 'undefined') {
    return;
  }
  const themeColor = isDark ? darkMode.bg : lightMode.bg;
  document.body.style.backgroundColor = themeColor;
  const themeMata = <HTMLMetaElement>document.querySelector('meta[name=theme-color]');
  if (themeMata) {
    themeMata.content = themeColor;
  } else {
    const meta = <HTMLMetaElement>document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = themeColor;
    document.getElementsByTagName('head')[0].appendChild(meta);
  }
}

// csr version:
function loadTheme() {
  if (typeof window === 'undefined') {
    return;
  }
  function setDataThemeAttribute(theme: string) {
    document.querySelector('html')?.setAttribute('data-theme', theme);
    setThemeMeta(theme === 'dark');
  }

  const preferDarkQuery = '(prefers-color-scheme: dark)';
  const mql = window.matchMedia(preferDarkQuery);
  const supportsColorSchemeQuery = mql.media === preferDarkQuery;
  let localStorageTheme = null;
  localStorageTheme = localStorage.getItem('color-scheme');

  if (localStorageTheme) {
    setDataThemeAttribute(localStorageTheme);
  } else if (supportsColorSchemeQuery && mql.matches) {
    setDataThemeAttribute('dark');
  }
}

// ssr-version
const loadThemeScript = `
  (function() {
    function setThemeMeta(isDark) {
      var themeColor = isDark ? '#282828' : '#fbf1c7';
      window.onload = function() {
        document.body.style.background = themeColor;
      }
      var elem = document.querySelector('meta[name=theme-color]');
      if (elem) {
        elem.content = themeColor;
      } else {
        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = themeColor;
        document.getElementsByTagName("head")[0].appendChild(meta);
      }
    }
    function setDataThemeAttribute(theme) {
      document.querySelector('html').setAttribute('data-theme', theme);
      setThemeMeta(theme === 'dark');
    }

    var preferDarkQuery = '(prefers-color-scheme: dark)';
    var mql = window.matchMedia(preferDarkQuery);
    var supportsColorSchemeQuery = mql.media === preferDarkQuery;
    var localStorageTheme = null;
    try {
      localStorageTheme = localStorage.getItem('color-scheme');
    } catch (err) {}
  
    if (localStorageTheme) {
      setDataThemeAttribute(localStorageTheme);
    } else if (supportsColorSchemeQuery && mql.matches) {
      setDataThemeAttribute('dark');
    }
  })();
`;

export { loadTheme, loadThemeScript, setThemeMeta };