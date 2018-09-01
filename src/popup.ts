window.onload = () => {
    const btn = document.querySelector('.fetchLinks');
    if (btn) {
        btn.addEventListener('click', () => {
            chrome.runtime.sendMessage('fetchLinks', (results) => console.log(results));
        });
    }
}
