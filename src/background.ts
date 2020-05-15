import { config } from './config';
import { isEmpty, fetchDomainString, fetchUrlString, isUrlInList, runtime, inSystemDarkMode } from './libs';
import { browser } from "webextension-polyfill-ts";

const initGithubDarkTheme = () => {
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        browser.storage.sync.get([
            config.storageDomainList,
            config.storageExcludedUrlList,
            'themeBasedOn'
        ])
        .then(data => {
            if (!tab) return;
            if (!tab.url) return;
            if (isUrlInList(fetchUrlString(tab.url), data.excludedUrlList)) return;

            console.log(`Current URL: ${tab.url}`);
            console.log('Domain List:');
            console.table(data.domainList);
            console.log('Excluded URL List:');
            console.table(data.excludedUrlList);
            
            const useSystemPrefersScheme = data.themeBasedOn == 'system-preferred';

            if (isUrlInList(fetchDomainString(tab.url), data.domainList)
            && (!useSystemPrefersScheme || useSystemPrefersScheme && inSystemDarkMode())) {
                browser.tabs.insertCSS(tab.id, {
                    file: config.cssFilePath,
                    runAt: 'document_start',
                });
            }
        });
    });
};

(function () {
    runtime.setUninstallURL(config.uninstallQuestionnaire);
    browser.storage.sync
        .get([config.storageDomainList, config.storageExcludedUrlList])
        .then(data => {
            if (!isEmpty(data.domainList) && !isEmpty(data.excludedUrlList) && !isEmpty(data.themeBasedOn)) return data;

            data = {
                domainList: config.defaultDomainList,
                excludedUrlList: config.defaultExcludedUrlList,
                themeBasedOn: config.themeBasedOn
            }
            browser.storage.sync.set(data);

            return data;
        })
        .then(initGithubDarkTheme);
})();
