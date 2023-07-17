import {BrowserWindow, dialog} from 'electron'

export function setupOnClose(mainWindow: BrowserWindow) {
  mainWindow.on('close', e => {
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm your actions',
      message: 'Do you really want to close the application?',
    })
    if (choice > 0) e.preventDefault()
  })
}
