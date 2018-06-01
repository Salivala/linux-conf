(function () {
    const bg = chrome.extension.getBackgroundPage();
    const config = bg.config;
    let params = {};

    /**
     * Start the app
     */
    function init() {
        // Breakdown the query string to variables in params
        window.location.search.replace('?', '').split('&').forEach(item => {
            const key = item.split('=')[0];
            params[key] = decodeURIComponent(item.split('=')[1]).replace(/\+/g, ' ');
        });

        // ------------ Events ------------
        // When a tab is activated, check if it's this tab, debounce,
        // check again if it's still active, and if it is then wake it up.
        chrome.tabs.getCurrent(originalTab => {
            chrome.tabs.onActivated.addListener(activeInfo => {
                if (activeInfo.tabId !== originalTab.id) return;

                setTimeout(() => {
                    chrome.tabs.get(activeInfo['tabId'], tab => {
                        if (!tab || !tab.active) return;
                        bg.tabs_last_active[tab.id] = Date.now();

                        if (tab.url.indexOf(chrome.extension.getURL("")) !== -1 && config.get('wake_up_on_focus')) {
                            return wakeup();
                        }

                        if (!bg.tabsScreenshots[tab.id]) {
                            bg.updateTabsScreenshots();
                        }
                    });
                }, 300);
            });
        });

        // This is used by the ui to notify tabs to wakeup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            sendResponse({response: "OK"});
            wakeup();
        });

        // Wake up the tab when clicking anywhere
        window.onclick = wakeup;

        // Update the page favicon & the icon image to the body
        generateFaviconUri(params.favIconUrl).then(faviconData => {
            document.getElementById('faviconLink').href = document.getElementById('faviconImg').src = faviconData;
        });

        // Update the title
        if (params.title) {
            document.title = params.title + ' (Hibernating)';
            document.getElementById("pageTitle").innerText = params.title;
        }

        // Set a screenshot in the background
        const screenshot = bg.tabsScreenshots[params.tabID];
        if (screenshot) {
            document.body.className = 'sc-available';
            document.getElementById('screenshot').style.backgroundImage = "url(" + screenshot + ")";
        }
    }

    /**
     * Get a link to a favicon and generate dataURI of alpha version of it
     * @param url
     */
    function generateFaviconUri(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                let canvas, context;
                canvas = window.document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                context = canvas.getContext("2d");
                context.globalAlpha = config.get('transparent_favicon');
                context.drawImage(img, 0, 0);
                resolve(canvas.toDataURL());
            };
            img.onerror = () => {
                if (!url) return reject(new Error('unable to generate favicon'));
                // Try again with the default ico
                generateFaviconUri(null, resolve); // TODO: Generate once in the background and reuse
            };
            img.src = url || chrome.extension.getURL("img/default.ico");
        });
    }

    /**
     * Handle wake up functionality
     */
    function wakeup() {
        if (params.originalUrl) {
            if (params.originalUrl.indexOf('chrome://') === 0) {
                window.history.back();
            } else {
                window.location.href = params.originalUrl;
            }
        } else {
            window.history.back();
        }
    }

    init();
}());