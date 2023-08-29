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

  await resetBrowserView(view, page)
}

export async function resetBrowserView(
  view: BrowserView,
  page: Config['pages'][0]
) {
  try {
    // delete page cache but not session
    await view.webContents.session.clearCache()

    await view.webContents.loadURL(page.startURL)
  } catch (error) {
    console.error('Error reseting view', error)
  }
}
