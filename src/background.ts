chrome.runtime.onMessage.addListener(
    (message, msgSender, callback) => {
        if (message === 'fetchLinks') {
            chrome.tabs.executeScript({
                code: `\`http://www.youtube.com/watch_videos?video_ids=\``
            }, (results: any[]) => callback(results));
        }
    });
