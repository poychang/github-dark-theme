import * as angular from 'angular';
import { config } from './config';
import { fetchDomainString, fetchUrlString, storage, tabs } from './libs';

module app {
    'use strict';

    interface IPopupScope extends angular.IScope { }

    class PopupController {
        static $inject = ['$scope'];
        private scope: IPopupScope;
        public domainList: string[];
        public excludedUrlList: string[];
        public yourDomain: string;
        public yourExcludedDomain: string;
        public useDarkTheme: boolean;

        constructor($scope: IPopupScope) {
            this.scope = $scope;
            this.init();
        }

        private init = () => {
            storage.sync
                .get([config.storageDomainList, config.storageExcludedUrlList])
                .then(data => {
                    this.domainList = data.domainList as string[];
                    this.excludedUrlList = data.excludedUrlList;
                    console.log(this.domainList);
                })
                .catch(error => {
                    this.domainList = ['ERROR'];
                    console.log(this.domainList);
                    console.log(error);
                })
                .finally(() => {
                    this.scope.$apply();
                });
        };

        public add = () => {
            let activeTabInfo = tabs.getCurrentTab();
            let url = this.yourDomain ? this.yourDomain : activeTabInfo.url;
            let domain = fetchDomainString(url);

            this.yourDomain = '';

            if (domain === '') return;
            if (this.domainList.includes(domain)) return;

            this.domainList.push(domain);
            storage.sync.set({ domainList: this.domainList });
        };

        public remove = (domain: string) => {
            this.domainList = [...this.domainList.filter(d => d !== domain)];
            storage.sync.set({ domainList: this.domainList });
        };

        public addExcludedUrl = () => {
            let activeTabInfo = tabs.getCurrentTab();
            let url = this.yourExcludedDomain ? this.yourExcludedDomain : activeTabInfo.url;
            let domain = fetchUrlString(url);

            this.yourExcludedDomain = '';

            if (domain === '') return;
            if (this.excludedUrlList.includes(domain)) return;

            this.excludedUrlList.push(domain);
            storage.sync.set({ excludedUrlList: this.excludedUrlList });
        };

        public removeExcludedUrl = (url: string) => {
            this.excludedUrlList = [...this.excludedUrlList.filter(u => u !== url)];
            storage.sync.set({ excludedUrlList: this.excludedUrlList });
        };

        public reset = () => {
            this.domainList = config.defaultDomainList;
            this.excludedUrlList = config.defaultExcludedUrlList;
            storage.sync.clear().then(() => {
                storage.sync.set({ domainList: config.defaultDomainList });
                storage.sync.set({ excludedUrlList: config.defaultExcludedUrlList });
            });
        };

        public navigate = (domain: string) => {
            tabs.createTab(domain);
        };

        public toggleDarkTheme = async (value: boolean) => {
            //TODO: save config into storage
            this.useDarkTheme = value;
        };
    }

    angular.module('app', []).controller('popupController', PopupController);
}
