import {BrowserView} from 'electron'
import {RebrowserAction} from '../../types'

export async function navigate(
  index: number,
  view: BrowserView,
  action: RebrowserAction
) {
  console.log(`Will navigate ${JSON.stringify(action)}`)
  const code = `window.location.href = ${JSON.stringify(action.url)};`

  await view.webContents.executeJavaScript(code)
}
