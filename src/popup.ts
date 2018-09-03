const getCurrentTab = (): Promise<chrome.tabs.Tab> =>
  new Promise(resolve => chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => resolve(tab)));

const sendMessage = (tabId: number, msg: any): Promise<any> =>
  new Promise(resolve => chrome.tabs.sendMessage(tabId, msg, resolve));

window.onload = () => {
  const btn = document.querySelector('.fetchLinks');
  if (btn) {
    btn.addEventListener('click', async () => {
      const tab = await getCurrentTab();
      if (tab && tab.id) {
        const response = await sendMessage(tab.id, {type: 'fetchLinks'});
        console.log(response);
        const node = document.querySelector('.playlist');
        if (node) {
          node.innerHTML = `<p>${response}</p><a href=${encodeURIComponent(response)}>playlist</a>`
        }
      }
    });
  }
}
