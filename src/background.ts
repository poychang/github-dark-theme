import { config } from './config';
import { isEmpty, fetchDomainString, fetchUrlString, isUrlInList, runtime } from './libs';
import { browser } from 'webextension-polyfill-ts';
import 'content-scripts-register-polyfill';

const initGithubDarkTheme = () => {
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'loading') {
            // Ignore 'loading' update for pages being unloaded in Firefox
            // Note that `url` property is set on page refresh in Firefox though `url` isn't actually changed
            if (FIREFOX && !changeInfo.url) return;

            browser.storage.sync
                .get([config.storageDomainList, config.storageExcludedUrlList])
                .then((data) => {
                    if (!tab) return;
                    if (!tab.url) return;
                    if (isUrlInList(fetchUrlString(tab.url), data.excludedUrlList)) return;

                    console.clear();
                    console.log(`Current URL: ${tab.url}`);
                    console.log('Domain List:');
                    console.table(data.domainList);
                    console.log('Excluded URL List:');
                    console.table(data.excludedUrlList);

                    const useSystemPrefersScheme = data.themeBasedOn == 'system-preferred';

                    if (isUrlInList(fetchDomainString(tab.url), data.domainList)) {
                        browser.tabs.insertCSS(tab.id, {
                            file: config.cssFilePath,
                            runAt: 'document_start',
                        });
                    }
                });
        }
    });
};

(function () {
    runtime.setUninstallURL(config.uninstallQuestionnaire);
    if (browser.storage) {
        console.log('Storage Mode');
        browser.storage.sync
            .get([config.storageDomainList, config.storageExcludedUrlList])
            .then((data) => {
                if (!isEmpty(data)) return data;

                browser.storage.sync.set({
                    domainList: config.defaultDomainList,
                    excludedUrlList: config.defaultExcludedUrlList,
                });
            })
            .then(initGithubDarkTheme);
    } else {
        console.log('ContentScripts Mode');
        browser.contentScripts
            .register({
                matches: ['"https://github.com/*', 'https://gist.github.com/*'],
                runAt: 'document_start',
                js: [{ file: 'app/content_script.js' }, { file: 'app/vendor.js' }],
                css: [{ file: 'app/app.css' }],
            })
            .catch((err) => console.log(err));
    }
})();
