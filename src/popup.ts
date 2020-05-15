import * as angular from 'angular';
import { browser } from "webextension-polyfill-ts";
import { config } from './config';
import { fetchDomainString, fetchUrlString } from './libs';
import { tabs } from './libs';

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
        public useSystemPreferredTheme: boolean;

        constructor($scope: IPopupScope) {
            this.scope = $scope;
            this.init();
        }

        private init = () => {
            browser.storage.sync
                .get([config.storageDomainList, config.storageExcludedUrlList, 'themeBasedOn'])
                .then(data => {
                    this.domainList = data.domainList as string[];
                    this.excludedUrlList = data.excludedUrlList;
                    this.useSystemPreferredTheme = data.themeBasedOn === 'system-preferred'
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
            tabs.getCurrentTab()
                .then(tab => {
                    let url = this.yourDomain ? this.yourDomain : tab.url;
                    let domain = fetchDomainString(url);

                    this.yourDomain = '';

                    if (domain === '') return;
                    if (this.domainList.includes(domain)) return;

                    this.domainList.push(domain);
                    browser.storage.sync.set({ domainList: this.domainList });
                });
        };

        public remove = (domain: string) => {
            this.domainList = [...this.domainList.filter(d => d !== domain)];
            browser.storage.sync.set({ domainList: this.domainList });
        };

        public addExcludedUrl = () => {
            tabs.getCurrentTab()
                .then(tab => {
                    let url = this.yourExcludedDomain ? this.yourExcludedDomain : tab.url;
                    let domain = fetchUrlString(url);

                    this.yourExcludedDomain = '';

                    if (domain === '') return;
                    if (this.excludedUrlList.includes(domain)) return;

                    this.excludedUrlList.push(domain);
                    browser.storage.sync.set({ excludedUrlList: this.excludedUrlList });
                });
        };

        public removeExcludedUrl = (url: string) => {
            this.excludedUrlList = [...this.excludedUrlList.filter(u => u !== url)];
            browser.storage.sync.set({ excludedUrlList: this.excludedUrlList });
        };

        public reset = () => {
            this.domainList = config.defaultDomainList;
            this.excludedUrlList = config.defaultExcludedUrlList;
            browser.storage.sync.clear().then(() => {
                browser.storage.sync.set({ domainList: config.defaultDomainList });
                browser.storage.sync.set({ excludedUrlList: config.defaultExcludedUrlList });
            });
        };

        public navigate = (domain: string) => { tabs.addTab(domain); };

        public toggleDarkTheme = async (value: boolean) => {
            //TODO: save config into storage
            this.useDarkTheme = value;
        };

        public toggleAutomaticThemeSwitching = async () => {
            this.useSystemPreferredTheme = !this.useSystemPreferredTheme;
            browser.storage.sync.set({
                themeBasedOn: this.useSystemPreferredTheme ? 'system-preferred' : 'user-setting'
            })
            .then(() =>
                {browser.storage.sync.get(['themeBasedOn'])
                .then(data => {
                    console.log(data.themeBasedOn)
                })}
            )
        };
    }

    angular.module('app', []).controller('popupController', PopupController);
}
