const getCurrentTab = (): Promise<chrome.tabs.Tab> =>
  new Promise(resolve => chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => resolve(tab)));

const sendMessage = (tabId: number, msg: any): Promise<any> =>
  new Promise(resolve => chrome.tabs.sendMessage(tabId, msg, resolve));


const setupMainButton = () => {
  const btn = document.querySelector('.main-button');
  if (btn) {
    btn.addEventListener('click', async () => {
      const tab = await getCurrentTab();
      if (tab && tab.id) {
        const response = await sendMessage(tab.id, {type: 'fetchLinks'});
        chrome.tabs.create({url: encodeURI(response)})
      }
    });
  }
}
const setupImgBackground = () => {
  const images = ['pexels-photo-196652.jpeg', 'pexels-photo-373945.jpeg', 'pexels-photo-374912.jpeg'];
  const index = Math.floor(Math.random() * images.length);
  const src = images[index];
  const imageElement: HTMLImageElement | null = document.querySelector('.main-button img');
  if (imageElement) {
    imageElement.src = src;
  }
}
window.onload = () => {
  setupMainButton();
  setupImgBackground();
}
