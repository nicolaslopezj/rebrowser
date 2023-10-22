import {RelaunchOptions, app} from 'electron'
import {autoUpdater} from 'electron-updater'
import {views} from '../pages'
import {dialog} from 'electron'
import {mainWindow} from '../main'
import {execFile} from 'child_process'

export function getAppVersion() {
  return app.getVersion()
}

/**
 * restarts the electron app
 */
export function restartApp() {
  console.log('restarting app...')
  const options: RelaunchOptions = {
    args: process.argv.slice(1).concat(['--relaunch']),
    execPath: process.execPath,
  }
  // Fix for .AppImage
  if (app.isPackaged && process.env.APPIMAGE) {
    execFile(process.env.APPIMAGE, options.args)
    app.quit()
    return
  }
  app.relaunch(options)
  app.quit()
}

/**
 * Reset all the cache of mainWindow
 */
export function resetAllNavigationStorageAndCache() {
  console.log('resetting all navigation storage and cache...')
  views.forEach(view => {
    view.webContents.session.clearStorageData()
  })
}

export async function checkForUpdates() {
  if (!autoUpdater.isUpdaterActive()) {
    throw new Error('Updater is not active')
  }
  const result = await autoUpdater.checkForUpdates()
  console.log(result)
  if (result.downloadPromise) {
    await result.downloadPromise

    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'An update is ready to install',
      message: `Version ${result.updateInfo.version} is ready to install, do you want to restart and install the update?`,
    })
    if (choice === 0) {
      autoUpdater.quitAndInstall()
    }
  }
  return JSON.parse(JSON.stringify(result))
}
