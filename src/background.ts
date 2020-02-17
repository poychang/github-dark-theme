import { config } from './config';
import { isEmpty, fetchDomainString, fetchUrlString, isUrlInList, storage } from './libs';

const initGithubDarkTheme = (domainList: string[]) => {
    console.log(domainList);
    chrome.tabs.getCurrent(tab => {
        if (!tab) return;
        if (!tab.url) return;
        if (isUrlInList(fetchUrlString(tab.url), config.excludeUrlList)) return;
        if (isUrlInList(fetchDomainString(tab.url), domainList)) insertCSS(tab.id);
    });
};

const addDomainListener = () => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (!tab) return;
        if (!tab.url) return;
        if (isUrlInList(fetchUrlString(tab.url), config.excludeUrlList)) return;

        storage.sync.get(config.storage.nameOfDomainList).then(data => {
            console.table('Domain List', data.domainList);
            if (isUrlInList(fetchDomainString(tab.url), data.domainList)){
				storage.sync.get('isEnabled').then(result => {					
					if(result.isEnabled == 'true') insertCSS(tab.id);
				});
			}
        });
    });
};

const insertCSS = (id: number) => {
    chrome.tabs.insertCSS(id, {
        file: 'app/app.css',
        runAt: 'document_start',
    });
};

const setUninstallQuestionnaire = () => {
    chrome.runtime.setUninstallURL(config.uninstallQuestionnaire, () => {
        console.log('We are sorry to see you go! :(');
    });
};

const activateGithubDarkTheme = () => {
    setUninstallQuestionnaire();
    storage.sync
        .get(config.storage.nameOfDomainList)
        .then(data => {
            if (isEmpty(data)) {
                data = { domainList: config.defaultDomainList };
                storage.sync.set(data);
            }
            return data.domainList as string[];
        })
        .then(initGithubDarkTheme)
        .finally(addDomainListener);
};

activateGithubDarkTheme();
