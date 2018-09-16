import { addLoader } from './loader';
import { getCurrentTab, injectContentScript, sendMessage } from './utils';

const youtubeApiRequest = (authKey: string, item: string, part: string[], data: object) => {
  const headers = new Headers([
    ['Authorization', `Bearer ${authKey}`],
    ['Content-Type', 'application/json']
  ]);
  const body = JSON.stringify(data);
  return fetch(new Request(`https://www.googleapis.com/youtube/v3/${item}?part=${part.join(',')}`,
    { headers, method: 'POST', mode: 'cors', body }))
    .then(reponse => reponse.json());
}


const createPlaylist = (key: string) =>
  youtubeApiRequest(key, 'playlists', ['snippet', 'status'], {
    snippet: {
      description: 'Generated playlist by youtube scraper extension',
      title: 'AutomaticPlaylist',
    },
  });


const addVideoToPlaylist = (key: string, playlistId: string, videoId: string) =>
  youtubeApiRequest(key, 'playlistItems', ['snippet'], {
    snippet: {
      playlistId,
      resourceId: {
        kind: 'youtube#video',
        videoId
      }
    }
  });

const initLoader = (element: Element) => {
  const div = addLoader(document.createElement('div'));
  div.className = 'btn';

  const freeLoadingText = document.createElement('div');
  freeLoadingText.className = 'loading-text';
  div.appendChild(freeLoadingText);

  if (element.parentElement) {
    element.parentElement.replaceChild(div, element);
  }
  return {
    updateText(text: string) {
      freeLoadingText.innerHTML = text;
    }
  };
}

export const setupYoutubeButton = (selector: string) => {
  const btn = document.querySelector(selector);
  if (btn) {
    btn.addEventListener('click', async () => {
      const tab = await getCurrentTab();
      await injectContentScript(tab);
      chrome.identity.getAuthToken({ interactive: true }, async (token) => {
        if (tab && tab.id) {
          try {
            const videoIds: string[] = await sendMessage(tab.id, { type: 'fetchLinks' });
            const loaderManager = initLoader(btn);
            const { id: playlistId } = await createPlaylist(token);
            for (const [index, videoId] of videoIds.entries()) {
              await addVideoToPlaylist(token, playlistId, videoId);
              loaderManager.updateText(`Loading ${index + 1}/${videoIds.length}`);
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
