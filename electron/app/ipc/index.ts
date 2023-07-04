import {ipcMain} from 'electron'
import {
  checkForUpdates,
  getAppVersion,
  resetAllNavigationStorageAndCache,
  restartApp,
} from '../lifecycle'
import {getConfig, setConfig} from '../config'
import {hidePage, showPage} from '../../pages'

export const handles = {
  restartApp,
  getConfig,
  setConfig,
  showPage,
  hidePage,
  resetAllNavigationStorageAndCache,
  getAppVersion,
  checkForUpdates,
}

export function initIpc() {
  for (const handle in handles) {
    const func = handles[handle]
    ipcMain.handle(handle, (event, ...args) => func(...args))
  }
}
