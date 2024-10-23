import {BrowserView} from 'electron'
import {Config} from '../../../app/config'
import {RebrowserAction} from '../../types'
import {getFrame} from '../executeScript/getFrame'

export async function reset(
  index: number,
  view: BrowserView,
  action: RebrowserAction,
  page: Config['pages'][0],
) {
  console.log(`Will reset ${JSON.stringify(action)}`)

  await resetBrowserView(view, page, index)
}

export async function resetBrowserView(view: BrowserView, page: Config['pages'][0], index: number) {
  try {
    console.log('will reset view', page)

    try {
      const win = await getFrame(view)
      win.executeJavaScript(`navigator.serviceWorker?.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister()
        }
      })`)
    } catch (error) {
      console.log('error cleaning service workers', error)
    }

    await view.webContents.session.clearCache()
    await view.webContents.session.clearHostResolverCache()

    await view.webContents.loadURL('about:blank')
    await new Promise(resolve => setTimeout(resolve, 1000))
    // delete page cache but not session
    await view.webContents.loadURL(page.startURL)
  } catch (error) {
    console.error('Error reseting view', error)
  }
}
