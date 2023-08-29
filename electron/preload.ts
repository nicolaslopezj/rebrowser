const {contextBridge, ipcRenderer} = require('electron')

const invokes = [
  'restartApp',
  'getConfig',
  'setConfig',
  'showPage',
  'hidePage',
  'resetPage',
  'getAppVersion',
  'checkForUpdates',
  'resetAllNavigationStorageAndCache',
  'testAutoConfigString',
  'setAudioMuted',
]

const events = ['onPageFaviconUpdated', 'onPageTitleUpdated', 'setPageLoading']

const channels = {}

for (const invoke of invokes) {
  channels[invoke] = (...args) => ipcRenderer.invoke(invoke, ...args)
}

for (const eventName of events) {
  channels[eventName] = callback => ipcRenderer.on(eventName, callback)
}

contextBridge.exposeInMainWorld('electronAPI', channels)
