// load theme from localStorage and system

// csr version:
function loadTheme() {
  if (typeof window === 'undefined') {
    return;
  }
  function setDataThemeAttribute(theme) {
    document.querySelector('html').setAttribute('data-theme', theme);
  }

  const preferDarkQuery = '(prefers-color-scheme: dark)';
  const mql = window.matchMedia(preferDarkQuery);
  const supportsColorSchemeQuery = mql.media === preferDarkQuery;
  let localStorageTheme = null;
  localStorageTheme = localStorage.getItem('color-scheme');
  const localStorageExists = localStorageTheme !== null;

  if (localStorageExists) {
    setDataThemeAttribute(localStorageTheme);
  } else if (supportsColorSchemeQuery && mql.matches) {
    setDataThemeAttribute('dark');
  }
}

// ssr-version
const loadThemeScript = `
  (function() {
    function setDataThemeAttribute(theme) {
      document.querySelector('html').setAttribute('data-theme', theme);
    }

    var preferDarkQuery = '(prefers-color-scheme: dark)';
    var mql = window.matchMedia(preferDarkQuery);
    var supportsColorSchemeQuery = mql.media === preferDarkQuery;
    var localStorageTheme = null;
    try {
      localStorageTheme = localStorage.getItem('color-scheme');
    } catch (err) {}
    var localStorageExists = localStorageTheme !== null;

    if (localStorageExists) {
      setDataThemeAttribute(localStorageTheme);
    } else if (supportsColorSchemeQuery && mql.matches) {
      setDataThemeAttribute('dark');
    }
  })();
`;

export { loadTheme, loadThemeScript };
