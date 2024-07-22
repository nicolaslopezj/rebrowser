import {ipcMain} from 'electron'
import {hidePage, resetPage, setAudioMuted, showPage} from '../../pages'
import {getConfigWithAutoConfig, setConfig, testAutoConfigString} from '../config'
import {
  checkForUpdates,
  getAppVersion,
  resetAllNavigationStorageAndCache,
  restartApp,
} from '../lifecycle'

export const handles = {
  restartApp,
  getConfig: getConfigWithAutoConfig,
  setConfig,
  showPage,
  hidePage,
  resetPage,
  resetAllNavigationStorageAndCache,
  getAppVersion,
  checkForUpdates,
  testAutoConfigString,
  setAudioMuted,
}

export function initIpc() {
  for (const handle in handles) {
    const func = handles[handle]
    ipcMain.handle(handle, (event, ...args) => func(...args))
  }
}
