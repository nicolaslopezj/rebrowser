import {app} from 'electron'
import {mainWindow} from '../main'
import {autoUpdater} from 'electron-updater'

export function getAppVersion() {
  return app.getVersion()
}

/**
 * restarts the electron app
 */
export function restartApp() {
  console.log('restarting app...')
  app.relaunch()
  app.exit()
}

/**
 * Reset all the cache of mainWindow
 */
export function resetAllNavigationStorageAndCache() {
  console.log('resetting all navigation storage and cache...')
  mainWindow.webContents.session.clearStorageData()
}

export async function checkForUpdates() {
  if (!autoUpdater.isUpdaterActive()) {
    throw new Error('Updater is not active')
  }
  const result = await autoUpdater.checkForUpdates()
  console.log(result)
  if (result.downloadPromise) {
    await result.downloadPromise
    autoUpdater.quitAndInstall()
  }
  return JSON.parse(JSON.stringify(result))
}
