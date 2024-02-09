import {BrowserView} from 'electron'
import {RebrowserAction} from '../../types'

export async function navigate(
  index: number,
  view: BrowserView,
  action: RebrowserAction,
) {
  console.log(`Will navigate ${JSON.stringify(action)}`)
  const url = action.url

  // navigate to url and wait for it to load
  view.webContents.loadURL(url)
  await new Promise(resolve => view.webContents.once('did-navigate', resolve))
}
