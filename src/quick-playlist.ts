import {getCurrentTab, injectContentScript, sendMessage} from './utils';

export const setupQuickPlaylist = () => {
  const btn = document.querySelector('.quick-playlist');
  if (btn) {
    btn.addEventListener('click', async () => {
      const tab = await getCurrentTab();
      await injectContentScript(tab);
      if (tab && tab.id) {
        try {
          const videoIds: string[] = await sendMessage(tab.id, {type: 'fetchLinks'});
          chrome.tabs.create({url: `https://www.youtube.com/watch_videos?video_ids?=${videoIds.join(',')}`})
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}