let _navigate = null;

export const setNavigator = (navigate) => { _navigate = navigate; };
export const navigateTo = (path) => _navigate?.(path);
