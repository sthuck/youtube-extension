import './assets/popup.scss';
import {setupQuickPlaylist} from './quick-playlist';
import {setupYoutubeButton} from './youtube-playlist';


const setupImgBackground = () => {
  const images = ['pexels-photo-196652.jpeg', 'pexels-photo-373945.jpeg', 'pexels-photo-374912.jpeg'];
  const index = Math.floor(Math.random() * images.length);
  const image = images[index];
  const containerElement: HTMLElement | null = document.querySelector('.container');
  if (containerElement) {
    containerElement.style.background = `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7) ), url("./${image}")`;
  }
}

window.onload = () => {
  setupQuickPlaylist();
  setupYoutubeButton();
  setupImgBackground();
}
