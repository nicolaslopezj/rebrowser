import {BrowserView} from 'electron'
import {RebrowserAction} from '../../types'
import {Config} from '../../../app/config'

export async function reset(
  index: number,
  view: BrowserView,
  action: RebrowserAction,
  page: Config['pages'][0]
) {
  console.log(`Will reset ${JSON.stringify(action)}`)

  await view.webContents.loadURL(page.startURL)
}
