import {getCurrentTab, injectContentScript, sendMessage} from "./utils";

const youtubeApiRequest = (authKey: string, item: string, part: string[], data: object) => {
  const headers = new Headers([
    ['Authorization', `Bearer ${authKey}`],
    ['Content-Type', 'application/json']
  ]);
  const body = JSON.stringify(data);
  return fetch(new Request(`https://www.googleapis.com/youtube/v3/${item}?part=${part.join(',')}`,
    {headers, method: 'POST', mode: 'cors', body}))
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

export const setupYoutubeButton = () => {
  const btn = document.querySelector('.youtube-playlist');
  if (btn) {
    btn.addEventListener('click', async () => {
      const tab = await getCurrentTab();
      await injectContentScript(tab);
      chrome.identity.getAuthToken({interactive: true}, async (token) => {
        if (tab && tab.id) {
          try {
            const videoIds: string[] = await sendMessage(tab.id, {type: 'fetchLinks'});
            const {id: playlistId} = await createPlaylist(token);
            for (const videoId of videoIds) {
              await addVideoToPlaylist(token, playlistId, videoId);
            }
            chrome.tabs.create({url: `https://www.youtube.com/playlist?list=${playlistId}`})
          } catch (e) {
            console.error(e);
          }
        }
      });
    });
  }
}
