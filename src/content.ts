(function () {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'fetchLinks':
        sendResponse(fetchLinks());
        break;
    }
  });

  const fetchLinks = () => {
    const baseUrl = `http://www.youtube.com/watch_videos?video_ids=`;
    const links = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')];
    const youtubeIds = links
      .filter(link => link.href.search(/(youtu\.be)|(youtube)/) >= 0)
      .map(link => decodeURIComponent(link.href))
      .map(link => /(?:youtu\.be\/([\w_-]+))|(?:youtube.com\/watch\?v=([\w_-]+))/.exec(link))
      .map(match => match && (match[1] || match[2]))
      .filter(youtubeId => !!youtubeId);
    const uniqueIds = [...new Set(youtubeIds)];
    return baseUrl + uniqueIds.join(',');
  }
})();