let startTime = null
let currentTabUrl = null

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        updateTracking(tab.url);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        updateTracking(tab.url);
    };
});

function updateTracking(url) {
    if (url !== currentTabUrl) {
        if (currentTabUrl) {
            const elapsedTime = Date.now() - startTime;
            chrome.storage.sync.get([currentTabUrl], (result) => {
                const timeSpent = result[currentTabUrl] || 0;
                chrome.storage.sync.set({ [currentTabUrl]: timeSpent + elapsedTime });
            });
        }
        currentTabUrl = url;
        startTime = Date.now();
    }
}