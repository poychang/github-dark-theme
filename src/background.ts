import { config, isEmpty, storage } from './libs';

function activateGithubDarkTheme() {
    storage.sync
        .get('domainList')
        .then(data => {
            if (isEmpty(data)) {
                data = { domainList: config.defaultDomainList };
                storage.sync.set(data);
            }
            return data.domainList as string[];
        })
        .then(initDomainList => {
            console.log(initDomainList);
            initDomainList.forEach(url => {
                let regex = new RegExp(url, 'g');
                chrome.tabs.getCurrent(tab => {
                    if (!tab) return;
                    if (!tab.url) return;
                    if (tab.url.match(regex)) {
                        chrome.tabs.insertCSS(tab.id, {
                            file: 'app/app.css',
                            runAt: 'document_start',
                        });
                    }
                });
            });
            chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
                if (!tab.url) return;

                storage.sync.get('domainList').then(data => {
                    data.domainList.forEach((url: string) => {
                        console.log(data.domainList);
                        console.log(tab.url);
                        let regex = new RegExp(url, 'g');
                        if (tab.url.match(regex)) {
                            chrome.tabs.insertCSS(tabId, {
                                file: 'app/app.css',
                                runAt: 'document_start',
                            });
                        }
                    });
                });
            });
        });
}

activateGithubDarkTheme();
