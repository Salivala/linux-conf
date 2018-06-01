// Generated by CoffeeScript 1.9.3
(function() {
  var BackgroundCommands, DISABLED_ICON, ENABLED_ICON, Frames, HintCoordinator, PARTIAL_ICON, TabOperations, completers, completionHandlers, completionSources, cycleToFrame, fn, frameIdsForTab, handleCompletions, handleFrameFocused, i, icon, iconImageData, j, len, len1, mkRepeatCommand, moveTab, onURLChange, portHandlers, ref, ref1, removeTabsRelative, root, scale, selectSpecificTab, selectTab, sendRequestHandlers, showUpgradeMessage, toggleMuteTab,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  chrome.runtime.onInstalled.addListener(function(arg) {
    var checkLastRuntimeError, contentScripts, jobs, manifest, reason;
    reason = arg.reason;
    if (reason === "chrome_update" || reason === "shared_module_update") {
      return;
    }
    if (Utils.isFirefox()) {
      return;
    }
    manifest = chrome.runtime.getManifest();
    contentScripts = manifest.content_scripts[0];
    jobs = [[chrome.tabs.executeScript, contentScripts.js], [chrome.tabs.insertCSS, contentScripts.css]];
    checkLastRuntimeError = function() {
      return chrome.runtime.lastError;
    };
    return chrome.tabs.query({
      status: "complete"
    }, function(tabs) {
      var file, files, func, i, len, results, tab;
      results = [];
      for (i = 0, len = tabs.length; i < len; i++) {
        tab = tabs[i];
        results.push((function() {
          var j, len1, ref, results1;
          results1 = [];
          for (j = 0, len1 = jobs.length; j < len1; j++) {
            ref = jobs[j], func = ref[0], files = ref[1];
            results1.push((function() {
              var k, len2, results2;
              results2 = [];
              for (k = 0, len2 = files.length; k < len2; k++) {
                file = files[k];
                results2.push(func(tab.id, {
                  file: file,
                  allFrames: contentScripts.all_frames
                }, checkLastRuntimeError));
              }
              return results2;
            })());
          }
          return results1;
        })());
      }
      return results;
    });
  });

  frameIdsForTab = {};

  root.portsForTab = {};

  root.urlForTab = {};

  root.tabLoadedHandlers = {};

  chrome.storage.local.set({
    vimiumSecret: Math.floor(Math.random() * 2000000000)
  });

  completionSources = {
    bookmarks: new BookmarkCompleter,
    history: new HistoryCompleter,
    domains: new DomainCompleter,
    tabs: new TabCompleter,
    searchEngines: new SearchEngineCompleter
  };

  completers = {
    omni: new MultiCompleter([completionSources.bookmarks, completionSources.history, completionSources.domains, completionSources.searchEngines]),
    bookmarks: new MultiCompleter([completionSources.bookmarks]),
    tabs: new MultiCompleter([completionSources.tabs])
  };

  completionHandlers = {
    filter: function(completer, request, port) {
      return completer.filter(request, function(response) {
        response = JSON.parse(JSON.stringify(response));
        try {
          return port.postMessage(extend(request, extend(response, {
            handler: "completions"
          })));
        } catch (_error) {}
      });
    },
    refresh: function(completer, _, port) {
      return completer.refresh(port);
    },
    cancel: function(completer, _, port) {
      return completer.cancel(port);
    }
  };

  handleCompletions = function(sender) {
    return function(request, port) {
      return completionHandlers[request.handler](completers[request.name], request, port);
    };
  };

  chrome.runtime.onConnect.addListener(function(port) {
    if (portHandlers[port.name]) {
      return port.onMessage.addListener(portHandlers[port.name](port.sender, port));
    }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    request = extend({
      count: 1,
      frameId: sender.frameId
    }, extend(request, {
      tab: sender.tab,
      tabId: sender.tab.id
    }));
    if (sendRequestHandlers[request.handler]) {
      sendResponse(sendRequestHandlers[request.handler](request, sender));
    }
    return false;
  });

  onURLChange = function(details) {
    return chrome.tabs.sendMessage(details.tabId, {
      name: "checkEnabledAfterURLChange"
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(onURLChange);

  chrome.webNavigation.onReferenceFragmentUpdated.addListener(onURLChange);

  (function() {
    var req;
    req = new XMLHttpRequest();
    req.open("GET", chrome.runtime.getURL("content_scripts/vimium.css"), true);
    req.onload = function() {
      var responseText, status;
      status = req.status, responseText = req.responseText;
      if (status === 200) {
        return chrome.storage.local.set({
          vimiumCSSInChromeStorage: responseText
        });
      }
    };
    return req.send();
  })();

  TabOperations = {
    openUrlInCurrentTab: function(request) {
      return chrome.tabs.update(request.tabId, {
        url: Utils.convertToUrl(request.url)
      });
    },
    openUrlInNewTab: function(request, callback) {
      var canUseOpenerTabId, tabConfig;
      if (callback == null) {
        callback = (function() {});
      }
      tabConfig = {
        url: Utils.convertToUrl(request.url),
        index: request.tab.index + 1,
        active: true,
        windowId: request.tab.windowId
      };
      if (request.active != null) {
        tabConfig.active = request.active;
      }
      if (tabConfig["url"] === Settings.defaults.newTabUrl) {
        delete tabConfig["url"];
      }
      canUseOpenerTabId = !(Utils.isFirefox() && Utils.compareVersions(Utils.firefoxVersion(), "57") < 0);
      if (canUseOpenerTabId) {
        tabConfig.openerTabId = request.tab.id;
      }
      return chrome.tabs.create(tabConfig, function(tab) {
        return callback(extend(request, {
          tab: tab,
          tabId: tab.id
        }));
      });
    },
    openUrlInNewWindow: function(request, callback) {
      var winConfig;
      if (callback == null) {
        callback = (function() {});
      }
      winConfig = {
        url: Utils.convertToUrl(request.url),
        active: true
      };
      if (request.active != null) {
        winConfig.active = request.active;
      }
      if (winConfig["url"] === Settings.defaults.newTabUrl) {
        delete winConfig["url"];
      }
      return chrome.windows.create(winConfig, callback);
    }
  };

  toggleMuteTab = (function() {
    var muteTab;
    muteTab = function(tab) {
      return chrome.tabs.update(tab.id, {
        muted: !tab.mutedInfo.muted
      });
    };
    return function(arg) {
      var currentTab, registryEntry;
      currentTab = arg.tab, registryEntry = arg.registryEntry;
      if ((registryEntry.options.all != null) || (registryEntry.options.other != null)) {
        return chrome.tabs.query({
          audible: true
        }, function(tabs) {
          var audibleUnmutedTabs, i, j, len, len1, results, results1, tab;
          if (registryEntry.options.other != null) {
            tabs = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = tabs.length; i < len; i++) {
                tab = tabs[i];
                if (tab.id !== currentTab.id) {
                  results.push(tab);
                }
              }
              return results;
            })();
          }
          audibleUnmutedTabs = (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = tabs.length; i < len; i++) {
              tab = tabs[i];
              if (tab.audible && !tab.mutedInfo.muted) {
                results.push(tab);
              }
            }
            return results;
          })();
          if (0 < audibleUnmutedTabs.length) {
            results = [];
            for (i = 0, len = audibleUnmutedTabs.length; i < len; i++) {
              tab = audibleUnmutedTabs[i];
              results.push(muteTab(tab));
            }
            return results;
          } else {
            results1 = [];
            for (j = 0, len1 = tabs.length; j < len1; j++) {
              tab = tabs[j];
              if (tab.mutedInfo.muted) {
                results1.push(muteTab(tab));
              }
            }
            return results1;
          }
        });
      } else {
        return muteTab(currentTab);
      }
    };
  })();

  selectSpecificTab = function(request) {
    return chrome.tabs.get(request.id, function(tab) {
      var ref;
      if ((ref = chrome.windows) != null) {
        ref.update(tab.windowId, {
          focused: true
        });
      }
      return chrome.tabs.update(request.id, {
        active: true
      });
    });
  };

  moveTab = function(arg) {
    var count, registryEntry, tab;
    count = arg.count, tab = arg.tab, registryEntry = arg.registryEntry;
    if (registryEntry.command === "moveTabLeft") {
      count = -count;
    }
    return chrome.tabs.query({
      currentWindow: true
    }, function(tabs) {
      var maxIndex, minIndex, pinnedCount;
      pinnedCount = (tabs.filter(function(tab) {
        return tab.pinned;
      })).length;
      minIndex = tab.pinned ? 0 : pinnedCount;
      maxIndex = (tab.pinned ? pinnedCount : tabs.length) - 1;
      return chrome.tabs.move(tab.id, {
        index: Math.max(minIndex, Math.min(maxIndex, tab.index + count))
      });
    });
  };

  mkRepeatCommand = function(command) {
    return function(request) {
      if (0 < request.count--) {
        return command(request, function(request) {
          return (mkRepeatCommand(command))(request);
        });
      }
    };
  };

  BackgroundCommands = {
    createTab: mkRepeatCommand(function(request, callback) {
      var newTabUrl, openNextUrl, opt, ref, urlList, urls, windowConfig;
      if (request.urls == null) {
        request.urls = request.url ? [request.url] : (urlList = (function() {
          var i, len, ref, results;
          ref = request.registryEntry.optionList;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            opt = ref[i];
            if (Utils.isUrl(opt)) {
              results.push(opt);
            }
          }
          return results;
        })(), 0 < urlList.length ? urlList : (newTabUrl = Settings.get("newTabUrl"), newTabUrl === "pages/blank.html" ? [request.tab.incognito ? "chrome://newtab" : chrome.runtime.getURL(newTabUrl)] : [newTabUrl]));
      }
      if (request.registryEntry.options.incognito || request.registryEntry.options.window) {
        windowConfig = {
          url: request.urls,
          incognito: (ref = request.registryEntry.options.incognito) != null ? ref : false
        };
        return chrome.windows.create(windowConfig, function() {
          return callback(request);
        });
      } else {
        urls = request.urls.slice(0).reverse();
        return (openNextUrl = function(request) {
          if (0 < urls.length) {
            return TabOperations.openUrlInNewTab(extend(request, {
              url: urls.pop()
            }), openNextUrl);
          } else {
            return callback(request);
          }
        })(request);
      }
    }),
    duplicateTab: mkRepeatCommand(function(request, callback) {
      return chrome.tabs.duplicate(request.tabId, function(tab) {
        return callback(extend(request, {
          tab: tab,
          tabId: tab.id
        }));
      });
    }),
    moveTabToNewWindow: function(arg) {
      var count, tab;
      count = arg.count, tab = arg.tab;
      return chrome.tabs.query({
        currentWindow: true
      }, function(tabs) {
        var activeTabIndex, ref, startTabIndex;
        activeTabIndex = tab.index;
        startTabIndex = Math.max(0, Math.min(activeTabIndex, tabs.length - count));
        ref = tabs.slice(startTabIndex, startTabIndex + count), tab = ref[0], tabs = 2 <= ref.length ? slice.call(ref, 1) : [];
        return chrome.windows.create({
          tabId: tab.id,
          incognito: tab.incognito
        }, function(window) {
          return chrome.tabs.move((function() {
            var i, len, results;
            results = [];
            for (i = 0, len = tabs.length; i < len; i++) {
              tab = tabs[i];
              results.push(tab.id);
            }
            return results;
          })(), {
            windowId: window.id,
            index: -1
          });
        });
      });
    },
    nextTab: function(request) {
      return selectTab("next", request);
    },
    previousTab: function(request) {
      return selectTab("previous", request);
    },
    firstTab: function(request) {
      return selectTab("first", request);
    },
    lastTab: function(request) {
      return selectTab("last", request);
    },
    removeTab: function(arg) {
      var count, tab;
      count = arg.count, tab = arg.tab;
      return chrome.tabs.query({
        currentWindow: true
      }, function(tabs) {
        var activeTabIndex, startTabIndex;
        activeTabIndex = tab.index;
        startTabIndex = Math.max(0, Math.min(activeTabIndex, tabs.length - count));
        return chrome.tabs.remove((function() {
          var i, len, ref, results;
          ref = tabs.slice(startTabIndex, startTabIndex + count);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            tab = ref[i];
            results.push(tab.id);
          }
          return results;
        })());
      });
    },
    restoreTab: mkRepeatCommand(function(request, callback) {
      return chrome.sessions.restore(null, callback(request));
    }),
    togglePinTab: function(arg) {
      var tab;
      tab = arg.tab;
      return chrome.tabs.update(tab.id, {
        pinned: !tab.pinned
      });
    },
    toggleMuteTab: toggleMuteTab,
    moveTabLeft: moveTab,
    moveTabRight: moveTab,
    nextFrame: function(arg) {
      var count, frameId, tabId;
      count = arg.count, frameId = arg.frameId, tabId = arg.tabId;
      frameIdsForTab[tabId] = cycleToFrame(frameIdsForTab[tabId], frameId, count);
      return chrome.tabs.sendMessage(tabId, {
        name: "focusFrame",
        frameId: frameIdsForTab[tabId][0],
        highlight: true
      });
    },
    closeTabsOnLeft: function(request) {
      return removeTabsRelative("before", request);
    },
    closeTabsOnRight: function(request) {
      return removeTabsRelative("after", request);
    },
    closeOtherTabs: function(request) {
      return removeTabsRelative("both", request);
    },
    visitPreviousTab: function(arg) {
      var count, tab, tabIds;
      count = arg.count, tab = arg.tab;
      tabIds = BgUtils.tabRecency.getTabsByRecency().filter(function(tabId) {
        return tabId !== tab.id;
      });
      if (0 < tabIds.length) {
        return selectSpecificTab({
          id: tabIds[(count - 1) % tabIds.length]
        });
      }
    },
    reload: function(arg) {
      var bypassCache, count, ref, ref1, registryEntry, tabId, windowId;
      count = arg.count, tabId = arg.tabId, registryEntry = arg.registryEntry, (ref = arg.tab, windowId = ref.windowId);
      bypassCache = (ref1 = registryEntry.options.hard) != null ? ref1 : false;
      return chrome.tabs.query({
        windowId: windowId
      }, function(tabs) {
        var i, len, position, ref2, results, tab;
        position = (function() {
          var i, index, len, tab;
          for (index = i = 0, len = tabs.length; i < len; index = ++i) {
            tab = tabs[index];
            if (tab.id === tabId) {
              return index;
            }
          }
        })();
        tabs = slice.call(tabs.slice(position)).concat(slice.call(tabs.slice(0, position)));
        count = Math.min(count, tabs.length);
        ref2 = tabs.slice(0, count);
        results = [];
        for (i = 0, len = ref2.length; i < len; i++) {
          tab = ref2[i];
          results.push(chrome.tabs.reload(tab.id, {
            bypassCache: bypassCache
          }));
        }
        return results;
      });
    }
  };

  removeTabsRelative = function(direction, arg) {
    var activeTab;
    activeTab = arg.tab;
    return chrome.tabs.query({
      currentWindow: true
    }, function(tabs) {
      var shouldDelete, tab;
      shouldDelete = (function() {
        switch (direction) {
          case "before":
            return function(index) {
              return index < activeTab.index;
            };
          case "after":
            return function(index) {
              return index > activeTab.index;
            };
          case "both":
            return function(index) {
              return index !== activeTab.index;
            };
        }
      })();
      return chrome.tabs.remove((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = tabs.length; i < len; i++) {
          tab = tabs[i];
          if (!tab.pinned && shouldDelete(tab.index)) {
            results.push(tab.id);
          }
        }
        return results;
      })());
    });
  };

  selectTab = function(direction, arg) {
    var count, tab;
    count = arg.count, tab = arg.tab;
    return chrome.tabs.query({
      currentWindow: true
    }, function(tabs) {
      var toSelect;
      if (1 < tabs.length) {
        toSelect = (function() {
          switch (direction) {
            case "next":
              return (tab.index + count) % tabs.length;
            case "previous":
              return (tab.index - count + count * tabs.length) % tabs.length;
            case "first":
              return Math.min(tabs.length - 1, count - 1);
            case "last":
              return Math.max(0, tabs.length - count);
          }
        })();
        return chrome.tabs.update(tabs[toSelect].id, {
          active: true
        });
      }
    });
  };

  chrome.webNavigation.onCommitted.addListener(function(arg) {
    var cssConf, frameId, tabId;
    tabId = arg.tabId, frameId = arg.frameId;
    cssConf = {
      frameId: frameId,
      code: Settings.get("userDefinedLinkHintCss"),
      runAt: "document_start"
    };
    return chrome.tabs.insertCSS(tabId, cssConf, function() {
      return chrome.runtime.lastError;
    });
  });

  ENABLED_ICON = "icons/browser_action_enabled.png";

  DISABLED_ICON = "icons/browser_action_disabled.png";

  PARTIAL_ICON = "icons/browser_action_partial.png";

  iconImageData = {};

  ref = [ENABLED_ICON, DISABLED_ICON, PARTIAL_ICON];
  for (i = 0, len = ref.length; i < len; i++) {
    icon = ref[i];
    iconImageData[icon] = {};
    ref1 = [19, 38];
    fn = function(icon, scale) {
      var canvas, context, image;
      canvas = document.createElement("canvas");
      canvas.width = canvas.height = scale;
      if (!((chrome.areRunningVimiumTests != null) && chrome.areRunningVimiumTests)) {
        context = canvas.getContext("2d");
        image = new Image;
        image.src = icon;
        image.onload = function() {
          context.drawImage(image, 0, 0, scale, scale);
          iconImageData[icon][scale] = context.getImageData(0, 0, scale, scale);
          return document.body.removeChild(canvas);
        };
        return document.body.appendChild(canvas);
      }
    };
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      scale = ref1[j];
      fn(icon, scale);
    }
  }

  Frames = {
    onConnect: function(sender, port) {
      var frameId, ref2, tabId;
      ref2 = [sender.tab.id, sender.frameId], tabId = ref2[0], frameId = ref2[1];
      port.onDisconnect.addListener(function() {
        return Frames.unregisterFrame({
          tabId: tabId,
          frameId: frameId,
          port: port
        });
      });
      port.postMessage({
        handler: "registerFrameId",
        chromeFrameId: frameId
      });
      (portsForTab[tabId] != null ? portsForTab[tabId] : portsForTab[tabId] = {})[frameId] = port;
      return (function(_this) {
        return function(request, port) {
          return _this[request.handler]({
            request: request,
            tabId: tabId,
            frameId: frameId,
            port: port,
            sender: sender
          });
        };
      })(this);
    },
    registerFrame: function(arg) {
      var frameId, port, tabId;
      tabId = arg.tabId, frameId = arg.frameId, port = arg.port;
      if (indexOf.call(frameIdsForTab[tabId] != null ? frameIdsForTab[tabId] : frameIdsForTab[tabId] = [], frameId) < 0) {
        return frameIdsForTab[tabId].push(frameId);
      }
    },
    unregisterFrame: function(arg) {
      var fId, frameId, port, ref2, registeredPort, tabId;
      tabId = arg.tabId, frameId = arg.frameId, port = arg.port;
      registeredPort = (ref2 = portsForTab[tabId]) != null ? ref2[frameId] : void 0;
      if (registeredPort === port || !registeredPort) {
        if (tabId in frameIdsForTab) {
          frameIdsForTab[tabId] = (function() {
            var k, len2, ref3, results;
            ref3 = frameIdsForTab[tabId];
            results = [];
            for (k = 0, len2 = ref3.length; k < len2; k++) {
              fId = ref3[k];
              if (fId !== frameId) {
                results.push(fId);
              }
            }
            return results;
          })();
        }
        if (tabId in portsForTab) {
          delete portsForTab[tabId][frameId];
        }
      }
      return HintCoordinator.unregisterFrame(tabId, frameId);
    },
    isEnabledForUrl: function(arg) {
      var base, enabledState, port, request, tabId;
      request = arg.request, tabId = arg.tabId, port = arg.port;
      if (request.frameIsFocused) {
        urlForTab[tabId] = request.url;
      }
      request.isFirefox = Utils.isFirefox();
      enabledState = Exclusions.isEnabledForUrl(request.url);
      if (request.frameIsFocused) {
        if (typeof (base = chrome.browserAction).setIcon === "function") {
          base.setIcon({
            tabId: tabId,
            imageData: (function() {
              var enabledStateIcon;
              enabledStateIcon = !enabledState.isEnabledForUrl ? DISABLED_ICON : 0 < enabledState.passKeys.length ? PARTIAL_ICON : ENABLED_ICON;
              return iconImageData[enabledStateIcon];
            })()
          });
        }
      }
      return port.postMessage(extend(request, enabledState));
    },
    domReady: function(arg) {
      var frameId, tabId;
      tabId = arg.tabId, frameId = arg.frameId;
      if (frameId === 0) {
        if (typeof tabLoadedHandlers[tabId] === "function") {
          tabLoadedHandlers[tabId]();
        }
        return delete tabLoadedHandlers[tabId];
      }
    },
    linkHintsMessage: function(arg) {
      var frameId, request, tabId;
      request = arg.request, tabId = arg.tabId, frameId = arg.frameId;
      return HintCoordinator.onMessage(tabId, frameId, request);
    },
    log: function(arg) {
      var frameId, message, ref2, sender;
      frameId = arg.frameId, sender = arg.sender, (ref2 = arg.request, message = ref2.message);
      return BgUtils.log(frameId + " " + message, sender);
    }
  };

  handleFrameFocused = function(arg) {
    var frameId, tabId;
    tabId = arg.tabId, frameId = arg.frameId;
    if (frameIdsForTab[tabId] == null) {
      frameIdsForTab[tabId] = [];
    }
    frameIdsForTab[tabId] = cycleToFrame(frameIdsForTab[tabId], frameId);
    return chrome.tabs.sendMessage(tabId, {
      name: "frameFocused",
      focusFrameId: frameId
    });
  };

  cycleToFrame = function(frames, frameId, count) {
    if (count == null) {
      count = 0;
    }
    count = (count + Math.max(0, frames.indexOf(frameId))) % frames.length;
    return slice.call(frames.slice(count)).concat(slice.call(frames.slice(0, count)));
  };

  HintCoordinator = {
    tabState: {},
    onMessage: function(tabId, frameId, request) {
      if (request.messageType in this) {
        return this[request.messageType](tabId, frameId, request);
      } else {
        return this.sendMessage(request.messageType, tabId, request);
      }
    },
    postMessage: function(tabId, frameId, messageType, port, request) {
      if (request == null) {
        request = {};
      }
      try {
        return port.postMessage(extend(request, {
          handler: "linkHintsMessage",
          messageType: messageType
        }));
      } catch (_error) {
        return this.unregisterFrame(tabId, frameId);
      }
    },
    sendMessage: function(messageType, tabId, request) {
      var frameId, port, ref2, results;
      if (request == null) {
        request = {};
      }
      ref2 = this.tabState[tabId].ports;
      results = [];
      for (frameId in ref2) {
        if (!hasProp.call(ref2, frameId)) continue;
        port = ref2[frameId];
        results.push(this.postMessage(tabId, parseInt(frameId), messageType, port, request));
      }
      return results;
    },
    prepareToActivateMode: function(tabId, originatingFrameId, arg) {
      var isVimiumHelpDialog, modeIndex;
      modeIndex = arg.modeIndex, isVimiumHelpDialog = arg.isVimiumHelpDialog;
      this.tabState[tabId] = {
        frameIds: frameIdsForTab[tabId].slice(0),
        hintDescriptors: {},
        originatingFrameId: originatingFrameId,
        modeIndex: modeIndex
      };
      this.tabState[tabId].ports = {};
      frameIdsForTab[tabId].map((function(_this) {
        return function(frameId) {
          return _this.tabState[tabId].ports[frameId] = portsForTab[tabId][frameId];
        };
      })(this));
      return this.sendMessage("getHintDescriptors", tabId, {
        modeIndex: modeIndex,
        isVimiumHelpDialog: isVimiumHelpDialog
      });
    },
    postHintDescriptors: function(tabId, frameId, arg) {
      var hintDescriptors, port, ref2, results;
      hintDescriptors = arg.hintDescriptors;
      if (indexOf.call(this.tabState[tabId].frameIds, frameId) >= 0) {
        this.tabState[tabId].hintDescriptors[frameId] = hintDescriptors;
        this.tabState[tabId].frameIds = this.tabState[tabId].frameIds.filter(function(fId) {
          return fId !== frameId;
        });
        if (this.tabState[tabId].frameIds.length === 0) {
          ref2 = this.tabState[tabId].ports;
          results = [];
          for (frameId in ref2) {
            if (!hasProp.call(ref2, frameId)) continue;
            port = ref2[frameId];
            if (frameId in this.tabState[tabId].hintDescriptors) {
              hintDescriptors = extend({}, this.tabState[tabId].hintDescriptors);
              delete hintDescriptors[frameId];
              results.push(this.postMessage(tabId, parseInt(frameId), "activateMode", port, {
                originatingFrameId: this.tabState[tabId].originatingFrameId,
                hintDescriptors: hintDescriptors,
                modeIndex: this.tabState[tabId].modeIndex
              }));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }
    },
    unregisterFrame: function(tabId, frameId) {
      var ref2;
      if (this.tabState[tabId] != null) {
        if (((ref2 = this.tabState[tabId].ports) != null ? ref2[frameId] : void 0) != null) {
          delete this.tabState[tabId].ports[frameId];
        }
        if ((this.tabState[tabId].frameIds != null) && indexOf.call(this.tabState[tabId].frameIds, frameId) >= 0) {
          return this.postHintDescriptors(tabId, frameId, {
            hintDescriptors: []
          });
        }
      }
    }
  };

  portHandlers = {
    completions: handleCompletions,
    frames: Frames.onConnect.bind(Frames)
  };

  sendRequestHandlers = {
    runBackgroundCommand: function(request) {
      return BackgroundCommands[request.registryEntry.command](request);
    },
    getCurrentTabUrl: function(arg) {
      var tab;
      tab = arg.tab;
      return tab.url;
    },
    openUrlInNewTab: mkRepeatCommand(function(request, callback) {
      return TabOperations.openUrlInNewTab(request, callback);
    }),
    openUrlInNewWindow: function(request) {
      return TabOperations.openUrlInNewWindow(request);
    },
    openUrlInIncognito: function(request) {
      return chrome.windows.create({
        incognito: true,
        url: Utils.convertToUrl(request.url)
      });
    },
    openUrlInCurrentTab: TabOperations.openUrlInCurrentTab,
    openOptionsPageInNewTab: function(request) {
      return chrome.tabs.create({
        url: chrome.runtime.getURL("pages/options.html"),
        index: request.tab.index + 1
      });
    },
    frameFocused: handleFrameFocused,
    nextFrame: BackgroundCommands.nextFrame,
    selectSpecificTab: selectSpecificTab,
    createMark: Marks.create.bind(Marks),
    gotoMark: Marks.goto.bind(Marks),
    sendMessageToFrames: function(request, sender) {
      return chrome.tabs.sendMessage(sender.tab.id, request.message);
    }
  };

  chrome.storage.local.remove("findModeRawQueryListIncognito");

  chrome.tabs.onRemoved.addListener(function(tabId) {
    var cache, k, len2, ref2;
    ref2 = [frameIdsForTab, urlForTab, portsForTab, HintCoordinator.tabState];
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      cache = ref2[k];
      delete cache[tabId];
    }
    return chrome.storage.local.get("findModeRawQueryListIncognito", function(items) {
      var ref3;
      if (items.findModeRawQueryListIncognito) {
        return (ref3 = chrome.windows) != null ? ref3.getAll(null, function(windows) {
          var l, len3, window;
          for (l = 0, len3 = windows.length; l < len3; l++) {
            window = windows[l];
            if (window.incognito) {
              return;
            }
          }
          return chrome.storage.local.remove("findModeRawQueryListIncognito");
        }) : void 0;
      }
    });
  });

  window.runTests = function() {
    return open(chrome.runtime.getURL('tests/dom_tests/dom_tests.html'));
  };

  (showUpgradeMessage = function() {
    var currentVersion, currentVersionNumbers, notification, notificationId, previousVersion, previousVersionNumbers, ref2;
    currentVersion = Utils.getCurrentVersion();
    if (!Settings.has("previousVersion")) {
      Settings.set("previousVersion", currentVersion);
    }
    previousVersion = Settings.get("previousVersion");
    if (Utils.compareVersions(currentVersion, previousVersion) === 1) {
      currentVersionNumbers = currentVersion.split(".");
      previousVersionNumbers = previousVersion.split(".");
      if (currentVersionNumbers.slice(0, 2).join(".") === previousVersionNumbers.slice(0, 2).join(".")) {
        return Settings.set("previousVersion", currentVersion);
      } else {
        notificationId = "VimiumUpgradeNotification";
        notification = {
          type: "basic",
          iconUrl: chrome.runtime.getURL("icons/vimium.png"),
          title: "Vimium Upgrade",
          message: "Vimium has been upgraded to version " + currentVersion + ". Click here for more information.",
          isClickable: true
        };
        if (((ref2 = chrome.notifications) != null ? ref2.create : void 0) != null) {
          return chrome.notifications.create(notificationId, notification, function() {
            if (!chrome.runtime.lastError) {
              Settings.set("previousVersion", currentVersion);
              return chrome.notifications.onClicked.addListener(function(id) {
                if (id === notificationId) {
                  return chrome.tabs.query({
                    active: true,
                    currentWindow: true
                  }, function(arg) {
                    var tab;
                    tab = arg[0];
                    return TabOperations.openUrlInNewTab({
                      tab: tab,
                      tabId: tab.id,
                      url: "https://github.com/philc/vimium#release-notes"
                    });
                  });
                }
              });
            }
          });
        } else {
          return chrome.permissions.onAdded.addListener(showUpgradeMessage);
        }
      }
    }
  })();

  chrome.runtime.onInstalled.addListener(function(arg) {
    var reason;
    reason = arg.reason;
    if (reason !== "chrome_update" && reason !== "shared_module_update") {
      return chrome.storage.local.set({
        installDate: new Date().toString()
      });
    }
  });

  extend(root, {
    TabOperations: TabOperations,
    Frames: Frames
  });

}).call(this);
