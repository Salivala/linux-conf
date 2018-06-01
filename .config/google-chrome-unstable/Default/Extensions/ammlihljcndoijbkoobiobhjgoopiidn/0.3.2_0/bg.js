window.default_config = {
    analytics_account: 'UA-16944395-23',

    first_run: true,
    auto_hibernate_after: 15, // in minutes
    wake_up_on_focus: true,
    transparent_favicon: 0.45,
    tab_screenshot: false,
    scan_tabs_interval: 10 * 60 * 1000
};

/*
 IDBWrapper - A cross-browser wrapper for IndexedDB
 Copyright (c) 2011 - 2013 Jens Arps
 http://jensarps.de/

 Licensed under the MIT (X11) license
*/
(function(h,j,i){"function"===typeof define?define(j):"undefined"!==typeof module&&module.exports?module.exports=j():i[h]=j()})("IDBStore",function(){var h=function(b){throw b;},j={storeName:"Store",storePrefix:"IDBWrapper-",dbVersion:1,keyPath:"id",autoIncrement:!0,onStoreReady:function(){},onError:h,indexes:[]},i=function(b,c){"undefined"==typeof c&&"function"==typeof b&&(c=b);"[object Object]"!=Object.prototype.toString.call(b)&&(b={});for(var a in j)this[a]="undefined"!=typeof b[a]?b[a]:j[a];
this.dbName=this.storePrefix+this.storeName;this.dbVersion=parseInt(this.dbVersion,10)||1;c&&(this.onStoreReady=c);a="object"==typeof window?window:self;this.idb=a.indexedDB||a.webkitIndexedDB||a.mozIndexedDB;this.keyRange=a.IDBKeyRange||a.webkitIDBKeyRange||a.mozIDBKeyRange;this.features={hasAutoIncrement:!a.mozIndexedDB};this.consts={READ_ONLY:"readonly",READ_WRITE:"readwrite",VERSION_CHANGE:"versionchange",NEXT:"next",NEXT_NO_DUPLICATE:"nextunique",PREV:"prev",PREV_NO_DUPLICATE:"prevunique"};this.openDB()};
i.prototype={constructor:i,version:"1.4.1",db:null,dbName:null,dbVersion:null,store:null,storeName:null,keyPath:null,autoIncrement:null,indexes:null,features:null,onStoreReady:null,onError:null,_insertIdCount:0,openDB:function(){var b=this.idb.open(this.dbName,this.dbVersion),c=!1;b.onerror=function(a){var b=!1;"error"in a.target?b="VersionError"==a.target.error.name:"errorCode"in a.target&&(b=12==a.target.errorCode);if(b)this.onError(Error("The version number provided is lower than the existing one."));
else this.onError(a)}.bind(this);b.onsuccess=function(a){if(!c)if(this.db)this.onStoreReady();else if(this.db=a.target.result,"string"==typeof this.db.version)this.onError(Error("The IndexedDB implementation in this browser is outdated. Please upgrade your browser."));else if(this.db.objectStoreNames.contains(this.storeName)){this.store=this.db.transaction([this.storeName],this.consts.READ_ONLY).objectStore(this.storeName);var b=Array.prototype.slice.call(this.getIndexList());this.indexes.forEach(function(a){var e=
a.name;e?(this.normalizeIndexData(a),this.hasIndex(e)?(this.indexComplies(this.store.index(e),a)||(c=!0,this.onError(Error('Cannot modify index "'+e+'" for current version. Please bump version number to '+(this.dbVersion+1)+"."))),b.splice(b.indexOf(e),1)):(c=!0,this.onError(Error('Cannot create new index "'+e+'" for current version. Please bump version number to '+(this.dbVersion+1)+".")))):(c=!0,this.onError(Error("Cannot create index: No index name given.")))},this);b.length&&(c=!0,this.onError(Error('Cannot delete index(es) "'+
b.toString()+'" for current version. Please bump version number to '+(this.dbVersion+1)+".")));c||this.onStoreReady()}else this.onError(Error("Something is wrong with the IndexedDB implementation in this browser. Please upgrade your browser."))}.bind(this);b.onupgradeneeded=function(a){this.db=a.target.result;if(this.db.objectStoreNames.contains(this.storeName))this.store=a.target.transaction.objectStore(this.storeName);else{a={autoIncrement:this.autoIncrement};if(null!==this.keyPath)a.keyPath=this.keyPath;
this.store=this.db.createObjectStore(this.storeName,a)}var b=Array.prototype.slice.call(this.getIndexList());this.indexes.forEach(function(a){var e=a.name;e||(c=!0,this.onError(Error("Cannot create index: No index name given.")));this.normalizeIndexData(a);this.hasIndex(e)?(this.indexComplies(this.store.index(e),a)||(this.store.deleteIndex(e),this.store.createIndex(e,a.keyPath,{unique:a.unique,multiEntry:a.multiEntry})),b.splice(b.indexOf(e),1)):this.store.createIndex(e,a.keyPath,{unique:a.unique,
multiEntry:a.multiEntry})},this);b.length&&b.forEach(function(a){this.store.deleteIndex(a)},this)}.bind(this)},deleteDatabase:function(){this.idb.deleteDatabase&&this.idb.deleteDatabase(this.dbName)},put:function(b,c,a,d){null!==this.keyPath&&(d=a,a=c,c=b);d||(d=h);a||(a=k);var f=!1,e=null,g=this.db.transaction([this.storeName],this.consts.READ_WRITE);g.oncomplete=function(){(f?a:d)(e)};g.onabort=d;g.onerror=d;null!==this.keyPath?(this._addIdPropertyIfNeeded(c),b=g.objectStore(this.storeName).put(c)):
b=g.objectStore(this.storeName).put(c,b);b.onsuccess=function(a){f=!0;e=a.target.result};b.onerror=d;return g},get:function(b,c,a){a||(a=h);c||(c=k);var d=!1,f=null,e=this.db.transaction([this.storeName],this.consts.READ_ONLY);e.oncomplete=function(){(d?c:a)(f)};e.onabort=a;e.onerror=a;b=e.objectStore(this.storeName).get(b);b.onsuccess=function(a){d=!0;f=a.target.result};b.onerror=a;return e},remove:function(b,c,a){a||(a=h);c||(c=k);var d=!1,f=null,e=this.db.transaction([this.storeName],this.consts.READ_WRITE);
e.oncomplete=function(){(d?c:a)(f)};e.onabort=a;e.onerror=a;b=e.objectStore(this.storeName)["delete"](b);b.onsuccess=function(a){d=!0;f=a.target.result};b.onerror=a;return e},batch:function(b,c,a){a||(a=h);c||(c=k);"[object Array]"!=Object.prototype.toString.call(b)&&a(Error("dataArray argument must be of type Array."));var d=this.db.transaction([this.storeName],this.consts.READ_WRITE);d.oncomplete=function(){(g?c:a)(g)};d.onabort=a;d.onerror=a;var f=b.length,e=!1,g=!1,l=function(){f--;0===f&&!e&&
(g=e=!0)};b.forEach(function(b){var c=b.type,f=b.key,g=b.value,b=function(b){d.abort();e||(e=!0,a(b,c,f))};if("remove"==c)g=d.objectStore(this.storeName)["delete"](f),g.onsuccess=l,g.onerror=b;else if("put"==c)null!==this.keyPath?(this._addIdPropertyIfNeeded(g),g=d.objectStore(this.storeName).put(g)):g=d.objectStore(this.storeName).put(g,f),g.onsuccess=l,g.onerror=b},this);return d},putBatch:function(b,c,a){return this.batch(b.map(function(a){return{type:"put",value:a}}),c,a)},removeBatch:function(b,
c,a){return this.batch(b.map(function(a){return{type:"remove",key:a}}),c,a)},getBatch:function(b,c,a,d){a||(a=h);c||(c=k);d||(d="sparse");"[object Array]"!=Object.prototype.toString.call(b)&&a(Error("keyArray argument must be of type Array."));var f=this.db.transaction([this.storeName],this.consts.READ_ONLY);f.oncomplete=function(){(l?c:a)(i)};f.onabort=a;f.onerror=a;var e=[],g=b.length,l=!1,i=null,j=function(a){a.target.result||"dense"==d?e.push(a.target.result):"sparse"==d&&e.length++;g--;0===g&&
(l=!0,i=e)};b.forEach(function(b){b=f.objectStore(this.storeName).get(b);b.onsuccess=j;b.onerror=function(b){i=b;a(b);f.abort()}},this);return f},getAll:function(b,c){c||(c=h);b||(b=k);var a=this.db.transaction([this.storeName],this.consts.READ_ONLY),d=a.objectStore(this.storeName);d.getAll?this._getAllNative(a,d,b,c):this._getAllCursor(a,d,b,c);return a},_getAllNative:function(b,c,a,d){var f=!1,e=null;b.oncomplete=function(){(f?a:d)(e)};b.onabort=d;b.onerror=d;b=c.getAll();b.onsuccess=function(a){f=
!0;e=a.target.result};b.onerror=d},_getAllCursor:function(b,c,a,d){var f=[],e=!1,g=null;b.oncomplete=function(){(e?a:d)(g)};b.onabort=d;b.onerror=d;b=c.openCursor();b.onsuccess=function(a){(a=a.target.result)?(f.push(a.value),a["continue"]()):(e=!0,g=f)};b.onError=d},clear:function(b,c){c||(c=h);b||(b=k);var a=!1,d=null,f=this.db.transaction([this.storeName],this.consts.READ_WRITE);f.oncomplete=function(){(a?b:c)(d)};f.onabort=c;f.onerror=c;var e=f.objectStore(this.storeName).clear();e.onsuccess=
function(b){a=!0;d=b.target.result};e.onerror=c;return f},_addIdPropertyIfNeeded:function(b){!this.features.hasAutoIncrement&&"undefined"==typeof b[this.keyPath]&&(b[this.keyPath]=this._insertIdCount++ +Date.now())},getIndexList:function(){return this.store.indexNames},hasIndex:function(b){return this.store.indexNames.contains(b)},normalizeIndexData:function(b){b.keyPath=b.keyPath||b.name;b.unique=!!b.unique;b.multiEntry=!!b.multiEntry},indexComplies:function(b,c){return["keyPath","unique","multiEntry"].every(function(a){if("multiEntry"==
a&&void 0===b[a]&&!1===c[a])return!0;if("keyPath"==a&&"[object Array]"==Object.prototype.toString.call(c[a])){var a=c.keyPath,d=b.keyPath;if("string"==typeof d)return a.toString()==d;if(!("function"==typeof d.contains||"function"==typeof d.indexOf)||d.length!==a.length)return!1;for(var f=0,e=a.length;f<e;f++)if(!(d.contains&&d.contains(a[f])||d.indexOf(-1!==a[f])))return!1;return!0}return c[a]==b[a]})},iterate:function(b,c){var c=m({index:null,order:"ASC",autoContinue:!0,filterDuplicates:!1,keyRange:null,
writeAccess:!1,onEnd:null,onError:h},c||{}),a="desc"==c.order.toLowerCase()?"PREV":"NEXT";c.filterDuplicates&&(a+="_NO_DUPLICATE");var d=!1,f=this.db.transaction([this.storeName],this.consts[c.writeAccess?"READ_WRITE":"READ_ONLY"]),e=f.objectStore(this.storeName);c.index&&(e=e.index(c.index));f.oncomplete=function(){if(d)if(c.onEnd)c.onEnd();else b(null);else c.onError(null)};f.onabort=c.onError;f.onerror=c.onError;a=e.openCursor(c.keyRange,this.consts[a]);a.onerror=c.onError;a.onsuccess=function(a){if(a=
a.target.result){if(b(a.value,a,f),c.autoContinue)a["continue"]()}else d=!0};return f},query:function(b,c){var a=[],c=c||{};c.onEnd=function(){b(a)};return this.iterate(function(b){a.push(b)},c)},count:function(b,c){var c=m({index:null,keyRange:null},c||{}),a=c.onError||h,d=!1,f=null,e=this.db.transaction([this.storeName],this.consts.READ_ONLY);e.oncomplete=function(){(d?b:a)(f)};e.onabort=a;e.onerror=a;var g=e.objectStore(this.storeName);c.index&&(g=g.index(c.index));g=g.count(c.keyRange);g.onsuccess=
function(a){d=!0;f=a.target.result};g.onError=a;return e},makeKeyRange:function(b){var c="undefined"!=typeof b.lower,a="undefined"!=typeof b.upper,d="undefined"!=typeof b.only;switch(!0){case d:b=this.keyRange.only(b.only);break;case c&&a:b=this.keyRange.bound(b.lower,b.upper,b.excludeLower,b.excludeUpper);break;case c:b=this.keyRange.lowerBound(b.lower,b.excludeLower);break;case a:b=this.keyRange.upperBound(b.upper,b.excludeUpper);break;default:throw Error('Cannot create KeyRange. Provide one or both of "lower" or "upper" value, or an "only" value.');
}return b}};var k=function(){},n={},m=function(b,c){var a,d;for(a in c)d=c[a],d!==n[a]&&d!==b[a]&&(b[a]=d);return b};i.version=i.prototype.version;return i},window);

const ONE_SECOND = 1000,
    ONE_MINUTE = ONE_SECOND * 60,
    FIVE_MINUTES = ONE_MINUTE * 5,
    TEN_MINUTES = ONE_MINUTE * 10,
    ONE_HOUR = ONE_MINUTE * 60;
window.ga = (function () {
    window._gaq = window._gaq || [];

    let initPromise;

    function init() {
        if (!initPromise) {
            initPromise = new Promise(resolve => {
                config.init().then(() => {
                    if (!config.get('analytics_account')) return resolve();

                    window._gaq.push(['_setAccount', config.get('analytics_account')]);
                    event('extension', 'startup');
                    heartbeat();

                    const app_version = chrome.app.getDetails().version;
                    if (localStorage.ga_stored_app_version !== app_version) {
                        if (!localStorage.ga_stored_app_version) {
                            event('extension', 'new_install', app_version);
                        } else {
                            event('extension', 'updated', app_version);
                        }
                        localStorage.ga_stored_app_version = app_version;
                    }

                    // Analytics script inject
                    const ga = document.createElement('script');
                    ga.type = 'text/javascript';
                    ga.async = true;
                    ga.src = 'https://ssl.google-analytics.com/ga.js';
                    const s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(ga, s);

                    void 0;

                    resolve();
                });
            });
        }

        return initPromise;
    }

    function heartbeat() {
        event('extension', 'heartbeat', '', 0, true);
        setTimeout(heartbeat, 10 * 60 * 1000);
    }

    function event(event, action = '', label = '', value = 0, interactive = false) {
        window._gaq.push(['_trackEvent', event, action, label, value, interactive]);
    }

    setTimeout(init, 0);

    return {
        init,
        event
    }
}());

window.config = (function () {
    let _config = window.default_config || {};
    let initPromise;

    function init() {
        if (!initPromise) {
            initPromise = new Promise(resolve => {
                storageGet(_config).then(_val => {
                    _config = _val;
                    void 0;

                    if (chrome.storage) {
                        chrome.storage.onChanged.addListener(_val => _config = _val);
                    }

                    resolve(_config);
                });
            });
        }

        return initPromise;
    }

    function get(key) {
        return _config[key];
    }

    function set(key, val) {
        return new Promise(resolve => {
            if (typeof key === 'string') {
                _config[key] = val;
            } else {
                Object.keys(key).forEach(key => _config[key] = val);
            }

            if (chrome.storage) {
                chrome.storage.sync.set(obj, () => resolve(_config));
            } else {
                localStorage.config = JSON.stringify(_config);
                resolve(_config);
            }
        });
    }

    function remove(key) {
        return new Promise(resolve => {
            chrome.storage.sync.remove(key, () => resolve());
        });
    }

    function clearAll() {
        return new Promise(resolve => {
            localStorage.removeItem('config');
            chrome.storage.sync.clear(() => {
                getConfig().then(resolve);
            });
        });
    }

    function storageGet(obj) {
        return new Promise(resolve => {
            if (!chrome.storage) {
                return resolve(JSON.parse(localStorage.config || JSON.stringify(obj)));
            }

            chrome.storage.sync.get(obj, _val => resolve(_val));
        });
    }

    function angularService(module) {
        module.factory('config', ['$q', function ($q) {
            return {
                init: () => $q(resolve => config.init().then(resolve)),
                get: (key) => $q(resolve => config.get(key).then(resolve)),
                set: (key, val) => $q(resolve => config.set(key, val).then(resolve)),
                remove: (key) => $q(resolve => config.remove(key).then(resolve)),
                clearAll: () => $q(resolve => config.clearAll().then(resolve)),
                _config: () => config._config()
            };
        }]);
    }

    init();

    return {
        init,
        get,
        set,
        remove,
        clearAll,
        _config: () => _config,
        angularService
    }
}());

window.idb = (function () {
    /**
     * PRIVATE VARS
     */
    var dataStores = {}; // Used for caching of data stores which are opened

    /**
     * getStore sees if a dataStore has already been initialized, if it doe's it continues to the call back
     * And if not, it will initialize the dataStore and then continue to the callback
     * @param storeName
     * @param callback
     * @returns {*}
     */
    function getStore(storeName, callback) {
        if (dataStores[storeName]) {
            return callback(null, dataStores[storeName]);
        }

        dataStores[storeName] = new IDBStore({
            dbVersion: 1,
            storeName: storeName,
            storePrefix: '',
            keyPath: 'id',
            onStoreReady: function () {
                callback(null, dataStores[storeName]);
            },
            onError: function (err) {
                void 0;
                callback(err);
            }
        });
    }

    /**
     * Get an object from a specific dataStore
     * @dataStore - name of the dataStore.
     * @objectID - Unique object identifier.
     * @callback - Callback function with result.
     */
    function get(table, objectID, callback) {
        getStore(table, function (err, store) {
            if (err) return callback(err);

            store.get(objectID, function (result) {
                callback(null, result);
            }, function (err) {
                void 0;
                callback(err);
            });
        });
    }

    /**
     * Get a list of all the objects in a specific data store
     * @table - name of the dataStore.
     * @callback - Callback function with result.
     */
    function getAll(table, callback) {
        getStore(table, function (err, store) {
            if (err) return callback(err);

            store.getAll(function (result) {
                var obj = {};
                result.forEach(function (object) {
                    obj[object.id] = object;
                });
                callback(null, obj);
            }, function (err) {
                void 0;
                callback(err);
            });
        });
    }

    /**
     * Add/Update an object in the data store
     * @param table
     * @param objectData
     * @param callback
     */
    function set(table, objectData, callback) {
        getStore(table, function (err, store) {
            if (err) return callback(err);

            objectData.id = objectData.id ? objectData.id.toString() : _id();
            store.put(objectData, function (result) {
                callback(null, result);
            }, function (err) {
                void 0;
                callback(err);
            });
        });
    }

    /**
     * Delete an item from a dataStore by it's objectID
     * @dataStore - name of the dataStore.
     * @objectID - Unique object identifier.
     * @callback - Callback function with result.
     */
    /**
     *
     */
    function remove(table, objectID, callback) {
        getStore(table, function (err, store) {
            if (err) return callback(err);

            store.remove(objectID, function (result) {
                callback(null, result);
            }, function (err) {
                void 0;
                callback(err);
            });
        });
    }

    /**
     *
     * @param table
     * @param callback
     */
    function clear(table, callback) {
        getStore(table, function (err, store) {
            if (err) return callback(err);

            store.clear(function () {
                callback(null);
            }, function (err) {
                void 0;
                callback(err);
            });
        });
    }

    /**
     *
     * @param table
     * @param array
     * @param callback
     */
    function batch(table, array, callback) {
        getStore(table, function (err, store) {
            if (err) return callback(err);

            store.batch(array, function (results) {
                callback(null, results);
            }, function (err) {
                void 0;
                callback(err);
            });
        });
    }

    /**
     * Generate a random id
     * @returns {*}
     * @private
     */
    function _id() {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };

        return s4() + s4();
    }

    /**
     * PUBLIC METHODS
     */
    return {
        getStore: getStore,
        get: get,
        getAll: getAll,
        set: set,
        remove: remove,
        clear: clear,
        batch: batch
    };
}());
const EXTENSION_URL = chrome.extension.getURL('');

// This is on the window so it'll be accessible by hibernating tabs
window.tabs_last_active = {};
window.tabsScreenshots = {};

/**
 * Init all the services and run the application waterfall
 */
window.onload = () => {
    // Initialize services
    config.init().then(() => {

        if (config.get('first_run')) {
            firstRun();
        }

        // Restore last session
        restoreSession().then(() => {
            chromeTabEvents();
            scanTabs();
        });
    });
};

/**
 * Add some default data when the extension starts for the first time
 */
function firstRun() {
    return new Promise(resolve => {
        // Default websites that should be ignored
        const ignoredSites = [
            {type: 'put', value: {mode: 'hostname', regexp: '(.*)mail.google.com'}},
            {type: 'put', value: {mode: 'hostname', regexp: '(.*)youtube.com'}},
            {type: 'put', value: {mode: 'hostname', regexp: '(.*)facebook.com'}},
            {type: 'put', value: {mode: 'hostname', regexp: '(.*)pandora.com'}},
            {type: 'put', value: {mode: 'hostname', regexp: '(.*)web.whatsapp.com'}},
            {type: 'put', value: {mode: 'hostname', regexp: '(.*)jango.com'}},
            {type: 'put', value: {mode: 'hostname', regexp: '(.*)soundcloud.com'}},
            {type: 'put', value: {mode: 'hostname', regexp: '(.*)twitch.com'}}
        ];

        idb.batch('IGNORED_LIST', ignoredSites, err => {
            if (err) return resolve();

            config.set('first_run', false);

            resolve();
        });
    });
}

/**
 * If we are back from a chrome update restore the tabs that were closed
 */
function restoreSession(callback) {
    return new Promise(resolve => {
        // Check if we are after update and restore the hibernating tabs from before the update
        if (config.get('stored_version') === chrome.app.getDetails().version) return resolve();

        config.set('stored_version', chrome.app.getDetails().version);

        // Prevent same tab from opening twice
        chrome.tabs.query({url: EXTENSION_URL + 'hibernate.html*'}, hibernatingTabs => {
            const urls = hibernatingTabs.map(tab => tab.url);

            idb.getAll('HIBERNATING_TABS', (err, hibernating_tabs) => {
                if (err) return callback(err);

                Object.keys(hibernating_tabs).forEach(key => {
                    const tab = hibernating_tabs[key];
                    if (_contains(urls, tab.url)) return;
                    chrome.tabs.create({url: tab.url, index: tab.index}, () => {
                    });
                });

                callback();
            });
        });
    });
}

/**
 * Track events from chrome and act as needed
 */
function chromeTabEvents() {
    chrome.tabs.onCreated.addListener(tab => {
        tabs_last_active[tab.id] = Date.now();
    });

    chrome.tabs.onUpdated.addListener((tabID, changeInfo, updatedTab) => {
        // Ignore the extension tabs because the event will fire on tabs that are moving to hibernate mode
        if (!_contains(updatedTab.url, EXTENSION_URL)) {
            tabs_last_active[tabID] = Date.now();

            if (!tabsScreenshots[tabID]) {
                updateTabsScreenshots();
            }
        }
    });

    chrome.tabs.onReplaced.addListener((newTabID, oldTabID) => {
        tabs_last_active[newTabID] = Date.now();
        delete tabs_last_active[oldTabID];

        tabsScreenshots[newTabID] = tabsScreenshots[oldTabID];
        delete tabsScreenshots[oldTabID];
    });

    chrome.tabs.onRemoved.addListener(tabID => {
        delete tabs_last_active[tabID];
        delete tabsScreenshots[tabID];
    });
}

/**
 * Scan the tabs and see if we have tabs that need to be put into hibernation
 */
function scanTabs() {
    idb.getAll('IGNORED_LIST', (err, ignored_sites) => {
        if (err) return setTimeout(scanTabs, config.get('scan_tabs_interval'));

        chrome.tabs.query({}, allTabs => {
            Promise.all(allTabs.map(tab => {
                return new Promise(resolve => {
                    // Should we ignore this tab?
                    let ignoreTab = tab.active || _contains(tab.url, EXTENSION_URL);

                    if (!ignoreTab) {
                        for (const key in ignored_sites) {
                            if (ignored_sites.hasOwnProperty(key)) {
                                const site = ignored_sites[key];
                                if (new RegExp(site.regexp).test(tab.url)) {
                                    ignoreTab = true;
                                    break;
                                }
                            }
                        }
                    }

                    // Is it time to hibernate?
                    if (!ignoreTab && tabs_last_active[tab.id] && Date.now() - tabs_last_active[tab.id] > config.get('auto_hibernate_after') * ONE_MINUTE) {
                        hibernateTab(tab).then(resolve);
                    } else {
                        if (!tabs_last_active[tab.id] || tab.active) {
                            tabs_last_active[tab.id] = Date.now();
                        }
                        return resolve();
                    }
                });
            })).then(() => {
                updateTabsScreenshots().then(() => {
                    storeSession(() => {
                        // Call the scanner again in the time defined
                        setTimeout(scanTabs, config.get('scan_tabs_interval'));
                    });
                });
            });
        });
    });
}

function hibernateTab(tab) {
    return new Promise(resolve => {
        // Hibernate page url
        const newURL = EXTENSION_URL + 'hibernate.html' + _toQueryString({
                tabID: tab.id,
                originalUrl: tab.url,
                favIconUrl: tab.favIconUrl,
                title: tab.title,
                timestamp: Date.now()
            });

        // Redirect to hibernation page
        chrome.tabs.update(tab.id, {url: newURL}, resolve);
    });
}

/**
 * Take a screenshot of all the active tabs and only if the setting is turned on.
 */
window.updateTabsScreenshots = () => {
    return new Promise(resolve => {
        if (!config.get('tab_screenshot')) return resolve();
        chrome.tabs.query({active: true}, activeTabs => {
            Promise.all(activeTabs.map(tab => {
                return new Promise(resolve => {
                    if (tab.status === "complete" && !_contains(tab.url, EXTENSION_URL)) {
                        chrome.tabs.captureVisibleTab(tab.windowId, {quality: 60}, dataURL => {
                            tabsScreenshots[tab.id] = dataURL;
                            resolve();
                            ga.event('tabs', 'screenshot-success');
                        });
                    } else {
                        resolve();
                    }
                });
            })).then(() => resolve());
        });
    });
};

/**
 * Store the current hibernating tabs session for restore after chrome closes or the extension updates
 */
function storeSession(callback) {
    idb.clear('HIBERNATING_TABS', err => {
        if (err) return callback();

        chrome.tabs.query({url: EXTENSION_URL + 'hibernate.html*'}, allTabs => {
            if (allTabs.length === 0) return callback();

            const batch = allTabs.map(tab => ({
                type: 'put',
                value: {
                    id: tab.id.toString(),
                    url: tab.url,
                    index: tab.index
                }
            }));

            idb.batch('HIBERNATING_TABS', batch, callback);
        });
    });
}

function _toQueryString(params) {
    const arr = [];
    Object.keys(params).forEach(key => {
        if (!params[key]) return;
        arr.push(key + '=' + encodeURIComponent(params[key]));
    });
    return arr.length > 0 ? '?' + arr.join('&') : '';
}

function _contains(hystack, needle) {
    return hystack.indexOf(needle) !== -1;
}