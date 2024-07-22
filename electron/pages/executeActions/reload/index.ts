import {BrowserView} from 'electron'
import {RebrowserAction} from '../../types'

export async function reload(index: number, view: BrowserView, action: RebrowserAction) {
  console.log(`Will reload ${JSON.stringify(action)}`)
  const code = `window.location.reload();`

  await view.webContents.executeJavaScript(code)
}
