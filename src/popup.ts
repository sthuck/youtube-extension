import './assets/popup.scss';
import { setupQuickPlaylist } from './quick-playlist';
import { setupYoutubeButton } from './youtube-playlist';


const setupImgBackground = () => {
  const images = ['pexels-photo-196652.jpeg', 'pexels-photo-1105666.jpeg', 'pexels-photo-374912.jpeg', 'pexels-photo-92080.jpeg'];
  const index = Math.floor(Math.random() * images.length);
  const image = images[index];
  const containerElement: HTMLElement | null = document.querySelector('.container');
  if (containerElement) {
    containerElement.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7) ), url("./${image}")`;
  }
}

const setupHelpButton = (selector: string) => {
  const helpButton = document.querySelector(selector);
  if (helpButton) {
    helpButton.addEventListener('click', () =>
      chrome.tabs.create({ url: `https://github.com/sthuck/youtube-extension/blob/master/docs/how-to-use.md` }))
  }
}
window.onload = () => {
  setupImgBackground();
  setupHelpButton('.help-btn');
  setupQuickPlaylist('.quick-playlist');
  setupYoutubeButton('.youtube-playlist');
}
