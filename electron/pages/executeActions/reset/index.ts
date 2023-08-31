import {BrowserView} from 'electron'
import {RebrowserAction} from '../../types'
import {Config} from '../../../app/config'
import {currentTab, showPage, startPage} from '../..'

export async function reset(
  index: number,
  view: BrowserView,
  action: RebrowserAction,
  page: Config['pages'][0]
) {
  console.log(`Will reset ${JSON.stringify(action)}`)

  await resetBrowserView(view, page, index)
}

export async function resetBrowserView(
  view: BrowserView,
  page: Config['pages'][0],
  index: number
) {
  try {
    console.log('will reset view', page)
    // delete page cache but not session
    await view.webContents.session.clearCache()

    startPage(page, index)

    if (currentTab === index) {
      showPage(index)
    }
  } catch (error) {
    console.error('Error reseting view', error)
  }
}
