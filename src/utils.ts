export const getCurrentTab = (): Promise<chrome.tabs.Tab> =>
  new Promise(resolve => chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => resolve(tab)));

export const sendMessage = (tabId: number, msg: any): Promise<any> =>
  new Promise(resolve => chrome.tabs.sendMessage(tabId, msg, resolve));

export const injectContentScript = (tab: chrome.tabs.Tab) =>
  new Promise((resolve, reject) => typeof tab.id !== 'undefined' ?
    chrome.tabs.executeScript(tab.id, { file: 'content.js' }, resolve)
    : reject('Error getting Tab'));

export const getAuthToken = () => new Promise(resolve => chrome.identity.getAuthToken({ interactive: true }, resolve));
export const removeCachedAuthToken = (token: string) => new Promise(resolve => chrome.identity.removeCachedAuthToken({ token }, resolve));
