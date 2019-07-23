import { config, isEmpty, storage } from './libs';

const init = (domainList: string[]) => {
    console.log(domainList);
    chrome.tabs.getCurrent(tab => {
        if (!tab) return;
        if (!tab.url) return;
        domainList.forEach(url => {
            let regex = new RegExp(url, 'g');
            if (tab.url.match(regex)) {
                chrome.tabs.insertCSS(tab.id, {
                    file: 'app/app.css',
                    runAt: 'document_start',
                });
            }
        });
    });
};

const addDomainListener = () => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (!tab) return;
        if (!tab.url) return;
        storage.sync.get(config.nameOfDomainList).then(data => {
            console.log(data.domainList);
            data.domainList.forEach((url: string) => {
                let regex = new RegExp(url, 'g');
                if (tab.url.match(regex)) {
                    chrome.tabs.insertCSS(tab.id, {
                        file: 'app/app.css',
                        runAt: 'document_start',
                    });
                }
            });
        });
    });
};

function activateGithubDarkTheme() {
    storage.sync
        .get(config.nameOfDomainList)
        .then(data => {
            if (isEmpty(data)) {
                data = { domainList: config.defaultDomainList };
                storage.sync.set(data);
            }
            return data.domainList as string[];
        })
        .then(init)
        .finally(addDomainListener);
}

activateGithubDarkTheme();
