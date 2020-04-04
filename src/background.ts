import { config } from './config';
import { isEmpty, fetchDomainString, fetchUrlString, isUrlInList, storage, tabs, runtime } from './libs';

const initGithubDarkTheme = () => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        storage.sync.get([config.storageDomainList, config.storageExcludedUrlList]).then(data => {
            if (!tab) return;
            if (!tab.url) return;
            if (isUrlInList(fetchUrlString(tab.url), data.excludedUrlList)) return;
            console.log(tab.url, data.domainList);
            if (isUrlInList(fetchDomainString(tab.url), data.domainList)) {
                tabs.insertCSS(tab.id, config.cssFilePath);
            }
        });
    });
};

(function() {
    runtime.setUninstallURL(config.uninstallQuestionnaire);
    storage.misc.showStorageOnConsole('domainList');
    storage.misc.showStorageOnConsole('excludedUrlList');
    storage.sync
        .get([config.storageDomainList, config.storageExcludedUrlList])
        .then(data => {
            if (!isEmpty(data.domainList) && !isEmpty(data.excludedUrlList)) {
                return data
            }
            
            data = {
                domainList: config.defaultDomainList,
                excludedUrlList: config.defaultExcludedUrlList
            }
            storage.sync.set(data);
            return data;
        })
        .then(initGithubDarkTheme);
})();
