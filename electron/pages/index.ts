import {WebContentsView} from 'electron'
import isDev from 'electron-is-dev'
import {type Config, getConfig} from '../app/config'
import {mainWindow} from '../main'
import {pollPendingInstructions} from './executeActions'
import {resetBrowserView} from './executeActions/reset'
import {getPagesFormAutoConfig} from './getPagesFromAutoConfig'
import {onRequestCompleted} from './send'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

export const views: WebContentsView[] = []
const config = getConfig()
let pages = config.pages

const tabsHeight = 40 + 28
export let currentTab = 0

export function startPage(page: Config['pages'][0], index: number) {
  const view = new WebContentsView({
    webPreferences: {
      autoplayPolicy: 'no-user-gesture-required',
      nodeIntegration: false,
      contextIsolation: true,
      offscreen: false,
      webSecurity: false,
      v8CacheOptions: 'none',
      allowRunningInsecureContent: true,
      partition: `persist:rebrowser-${page.partition ?? index}`,
    },
  })
  views[index] = view

  view.webContents.setBackgroundThrottling(false)
  const sharedWorkers = view.webContents.getAllSharedWorkers()
  console.log('shared workers', sharedWorkers)

  // mute audio
  if (getConfig().muteAudio) {
    view.webContents.setAudioMuted(true)
  }

  if (isDev) {
    view.webContents.openDevTools()
  }

  let userAgent = view.webContents.getUserAgent()
  userAgent = userAgent.replace(/Electron\/[0-9\.]+\s/, '').replace(/rebrowser\/[0-9\.]+\s/, '')
  view.webContents.setUserAgent(userAgent)

  hidePage(index)

  try {
    view.webContents.debugger.attach('1.3')
  } catch (err) {
    console.log('Debugger attach failed: ', err)
  }
  view.webContents.debugger.on('detach', (_event, reason) => {
    console.log('Debugger detached due to: ', reason)
  })

  const requestsMap = new Map<
    string,
    {
      headers: any
      requestBody?: string
      requestMethod?: string
    }
  >()

  view.webContents.debugger.on('message', (_event, method, params) => {
    if (method === 'Network.requestWillBeSent') {
      if (!['Fetch', 'XHR'].includes(params.type)) return

      const headers = params.request.headers

      const requestMethod = params.request.method
      const requestBody = params.request.postData

      requestsMap.set(params.requestId, {
        headers,
        requestBody,
        requestMethod,
      })
    }

    if (method === 'Network.responseReceived') {
      if (!['Fetch', 'XHR'].includes(params.type)) return

      setTimeout(() => {
        // if response body is 0, then dont get response body
        if (params.response.headers['content-length'] === '0') {
          onRequestCompleted(
            index,
            page,
            params.response,
            requestsMap.get(params.requestId)?.headers,
            '{}',
            requestsMap.get(params.requestId)?.requestBody,
            requestsMap.get(params.requestId)?.requestMethod,
          )

          requestsMap.delete(params.requestId)
          return
        }

        view.webContents.debugger
          .sendCommand('Network.getResponseBody', {
            requestId: params.requestId,
          })
          .then(response => {
            const body = response.base64Encoded
              ? Buffer.from(response.body, 'base64').toString()
              : response.body

            onRequestCompleted(
              index,
              page,
              params.response,
              requestsMap.get(params.requestId)?.headers,
              body,
              requestsMap.get(params.requestId)?.requestBody,
              requestsMap.get(params.requestId)?.requestMethod,
            )
            requestsMap.delete(params.requestId)
          })
          .catch(err => {
            console.log(params.response?.url, params.type, err)
            onRequestCompleted(
              index,
              page,
              params.response,
              requestsMap.get(params.requestId)?.headers,
              '{}',
              requestsMap.get(params.requestId)?.requestBody,
              requestsMap.get(params.requestId)?.requestMethod,
            )
            requestsMap.delete(params.requestId)
          })
      }, 500)
    }
  })
  view.webContents.debugger.sendCommand('Network.enable')

  // get the current favicon
  view.webContents.on('page-favicon-updated', (_event, favicons) => {
    const imageURL = favicons[0]
    mainWindow.webContents.send('onPageFaviconUpdated', {
      index,
      imageURL,
    })
  })

  view.webContents.on('page-title-updated', (_event, title) => {
    console.log('page-title-updated', title)
    mainWindow.webContents.send('onPageTitleUpdated', {
      index,
      title,
    })
  })

  view.webContents.on('did-start-loading', () => {
    mainWindow.webContents.send('setPageLoading', {
      index,
      loading: true,
    })
  })

  view.webContents.on('dom-ready', () => {
    // block a connection to a domain
    const filter = {
      urls: ['*://*.arkoselabs.com/*'],
    }

    view.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
      if (details.url.includes('arkoselabs.com')) {
        console.log('Blocking request to arkoselabs.com', details)
        callback({cancel: true})
      }
    })

    view.webContents.mainFrame.framesInSubtree.forEach(frame => {
      frame.executeJavaScript(`
        let didExecute = false;
        navigator.serviceWorker?.getRegistrations().then(registrations => {
          for (const registration of registrations) {
          console.log("unregistering worker")
            didExecute = true;
            registration.unregister()
          }
          if (didExecute) {
            window.location.reload()
          }
        })
      `)
    })
  })

  view.webContents.on('did-stop-loading', () => {
    mainWindow.webContents.send('setPageLoading', {
      index,
      loading: false,
    })
  })

  view.webContents.mainFrame.framesInSubtree.forEach(frame => {
    frame.executeJavaScript('window.print=()=>{}')
  })

  // on main window resize, resize the browser view
  mainWindow.on('resize', () => {
    setBounds(views[currentTab])
  })

  view.webContents.loadURL(page.startURL)

  mainWindow.contentView.addChildView(view)

  setInterval(() => {
    pollPendingInstructions(index, page).catch(console.error)
  }, 5000)
}

export async function startPages() {
  if (config?.autoConfigString) {
    pages = await getPagesFormAutoConfig()
  }

  console.log('starting rebrowser with pages', pages)

  if (!pages?.length) {
    return
  }

  for (let i = 0; i < pages?.length; i++) {
    startPage(pages[i], i)
  }
}

export function setBounds(view: WebContentsView) {
  const {width, height} = mainWindow.getBounds()
  view.setBounds({x: 0, y: tabsHeight, width, height: height - tabsHeight})
}

export function showPage(index: number) {
  const view = views[index]
  if (!view) {
    return
  }
  setBounds(view)
  currentTab = index
}

export function hidePage(index: number) {
  const view = views[index]
  if (!view) {
    return
  }
  view.setBounds({x: 0, y: 0, width: 0, height: 0})
}

export async function resetPage(index: number) {
  console.log('received reset page', index)
  const view = views[index]
  if (!view) return
  console.log('reset page', config.pages, config.pages[index])
  const page = pages[index]
  if (!page) return

  await resetBrowserView(view, page, index)
  if (currentTab === index) {
    showPage(index)
  }
}

export function setAudioMuted(muted: boolean) {
  views.forEach(view => {
    view.webContents.setAudioMuted(muted)
  })
}
