export const getCurrentTab = (): Promise<chrome.tabs.Tab> =>
  new Promise(resolve => chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => resolve(tab)));

export const sendMessage = <T = any>(tabId: number, msg: any): Promise<T> =>
  new Promise<T>(resolve => chrome.tabs.sendMessage(tabId, msg, resolve));

export const injectContentScript = (tab: chrome.tabs.Tab) =>
  new Promise<any>((resolve, reject) => typeof tab.id !== 'undefined' ?
    chrome.tabs.executeScript(tab.id, { file: 'content.js' }, resolve)
    : reject('Error getting Tab'));

export const getAuthToken = () => new Promise<string>(resolve => chrome.identity.getAuthToken({ interactive: true }, resolve));
export const removeCachedAuthToken = (token: string) => new Promise<void>(resolve => chrome.identity.removeCachedAuthToken({ token }, resolve));
