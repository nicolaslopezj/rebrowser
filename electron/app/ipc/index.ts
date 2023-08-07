import {ipcMain} from 'electron'
import {
  checkForUpdates,
  getAppVersion,
  resetAllNavigationStorageAndCache,
  restartApp,
} from '../lifecycle'
import {
  getConfigWithAutoConfig,
  setConfig,
  testAutoConfigString,
} from '../config'
import {hidePage, setAudioMuted, showPage} from '../../pages'

export const handles = {
  restartApp,
  getConfig: getConfigWithAutoConfig,
  setConfig,
  showPage,
  hidePage,
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
