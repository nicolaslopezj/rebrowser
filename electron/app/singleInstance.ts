import {app} from 'electron'
import {mainWindow} from '../main'

/** Check if single instance, if not, simply quit new instance */
let isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
  app.quit()
}

// Behaviour on second instance for parent process- Pretty much optional
app.on('second-instance', (event, argv, cwd) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})
