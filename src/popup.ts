import './assets/popup.scss';

const getCurrentTab = (): Promise<chrome.tabs.Tab> =>
  new Promise(resolve => chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => resolve(tab)));

const sendMessage = (tabId: number, msg: any): Promise<any> =>
  new Promise(resolve => chrome.tabs.sendMessage(tabId, msg, resolve));

const createPlaylist = (key: string) => {
  const headers = new Headers([
    ['Authorization', `Bearer ${key}`],
    ['Content-Type', 'application/json']
  ]);
  const body = JSON.stringify({
    snippet: {
      description: 'Generated playlist by youtube scraper extension',
      title: 'AutomaticPlaylist',
    },
  });
  return fetch(new Request('https://www.googleapis.com/youtube/v3/playlists?part=snippet,status', { headers, method: 'POST', mode: 'cors', body })).
    then(reponse => reponse.json());
}

const addVideoToPlaylist = (key: string, playlistId: string, videoId: string) => {
  const headers = new Headers([
    ['Authorization', `Bearer ${key}`],
    ['Content-Type', 'application/json']
  ]);
  const body = JSON.stringify({
    snippet: {
      playlistId,
      resourceId: {
        kind: 'youtube#video',
        videoId
      }
    },
  });
  return fetch(new Request('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', { headers, method: 'POST', mode: 'cors', body })).
    then(reponse => reponse.json());
}


const injectContentScript = (tab: chrome.tabs.Tab) =>
  new Promise((resolve, reject) => typeof tab.id !== 'undefined' ?
    chrome.tabs.executeScript(tab.id, { file: 'content.js' }, resolve)
    : reject('Error getting Tab'));

const setupMainButton = () => {
  const btn = document.querySelector('.main-button');
  if (btn) {
    btn.addEventListener('click', async () => {
      chrome.identity.getAuthToken({ interactive: true }, async (token) => {
        const tab = await getCurrentTab();
        await injectContentScript(tab);
        if (tab && tab.id) {
          try {
            const videoIds: string[] = await sendMessage(tab.id, { type: 'fetchLinks' });
            const { id: playlistId } = await createPlaylist(token);
            for (const videoId of videoIds) {
              await addVideoToPlaylist(token, playlistId, videoId);
            }
            chrome.tabs.create({ url: `https://www.youtube.com/playlist?list=${playlistId}` })
          } catch (e) {
            console.error(e);
          }
        }
      });
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
