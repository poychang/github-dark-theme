const config = {
    cssFilePath: 'app/app.css',
    storageDomainList: 'domainList',
    storageExcludedUrlList: 'excludedUrlList',
    domainList: [],
    defaultDomainList: ['github.com', 'gist.github.com'],
    excludedUrlList: [],
    defaultExcludedUrlList: ['github.com/marketplace'],
    useSystemPrefersScheme: false,
    themeBasedOn: 'system-preferred',
    uninstallQuestionnaire:
        'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__c9PL4pUQ0pFOVpUQzdLRERIQlc4RVZSSEZVSDM2OS4u',
} as Config;

interface Config {
    cssFilePath: string;
    storageDomainList: string;
    storageExcludedUrlList: string;
    domainList: string[];
    defaultDomainList: string[];
    excludedUrlList: string[];
    defaultExcludedUrlList: string[];
    useSystemPrefersScheme: boolean;
    themeBasedOn: 'system-preferred' | 'user-setting';
    uninstallQuestionnaire: string;
}

export { config, Config };
