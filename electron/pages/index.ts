import {BrowserView} from 'electron'
import {Config, getConfig} from '../app/config'
import {mainWindow} from '../main'
import {onRequestCompleted} from './send'
import {pollPendingInstructions} from './executeActions'
import {getPagesFormAutoConfig} from './getPagesFromAutoConfig'

export let views: BrowserView[] = []

const tabsHeight = 40 + 28
let currentTab = 0

export function startPage(page: Config['pages'][0], index: number) {
  const view = new BrowserView({
    webPreferences: {
      autoplayPolicy: 'no-user-gesture-required',
      nodeIntegration: false,
      contextIsolation: true,
      offscreen: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      partition: `persist:rebrowser-${page.partition ?? index}`,
    },
  })
  view.webContents.setBackgroundThrottling(false)

  // mute audio
  if (getConfig().muteAudio) {
    view.webContents.setAudioMuted(true)
  }

  let userAgent = view.webContents.getUserAgent()
  userAgent = userAgent
    .replace(/Electron\/[0-9\.]+\s/, '')
    .replace(/rebrowser\/[0-9\.]+\s/, '')
  view.webContents.setUserAgent(userAgent)

  view.setBounds({x: 0, y: 0, width: 0, height: 0}) // hice the view

  try {
    view.webContents.debugger.attach('1.3')
  } catch (err) {
    console.log('Debugger attach failed: ', err)
  }
  view.webContents.debugger.on('detach', (event, reason) => {
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

  view.webContents.debugger.on('message', (event, method, params) => {
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
            view,
            page,
            params.response,
            requestsMap.get(params.requestId)?.headers,
            '{}',
            requestsMap.get(params.requestId)?.requestBody,
            requestsMap.get(params.requestId)?.requestMethod
          )

          return
        }

        view.webContents.debugger
          .sendCommand('Network.getResponseBody', {requestId: params.requestId})
          .then(function (response) {
            const body = response.base64Encoded
              ? Buffer.from(response.body, 'base64').toString()
              : response.body

            onRequestCompleted(
              index,
              view,
              page,
              params.response,
              requestsMap.get(params.requestId)?.headers,
              body,
              requestsMap.get(params.requestId)?.requestBody,
              requestsMap.get(params.requestId)?.requestMethod
            )
          })
          .catch(function (err) {
            console.log(params.response?.url, params.type, err)
            onRequestCompleted(
              index,
              view,
              page,
              params.response,
              requestsMap.get(params.requestId)?.headers,
              '{}',
              requestsMap.get(params.requestId)?.requestBody,
              requestsMap.get(params.requestId)?.requestMethod
            )
          })
      }, 500)
    }
  })
  view.webContents.debugger.sendCommand('Network.enable')

  views[index] = view

  view.webContents.loadURL(page.startURL)

  setInterval(() => {
    pollPendingInstructions(index, view, page).catch(console.error)
  }, 5000)

  mainWindow.addBrowserView(view)

  // get the current favicon
  view.webContents.on('page-favicon-updated', (event, favicons) => {
    const imageURL = favicons[0]

    console.log('page-favicon-updated', imageURL)
    mainWindow.webContents.send('onPageFaviconUpdated', {
      index,
      imageURL,
    })
  })

  view.webContents.mainFrame.framesInSubtree.forEach(frame => {
    frame.executeJavaScript('window.print=()=>{}')
  })

  // on main window resize, resize the browser view
  mainWindow.on('resize', () => {
    setBounds(views[currentTab])
  })
}

export async function startPages() {
  const config = getConfig()
  let pages = config.pages

  if (config?.autoConfigString) {
    pages = await getPagesFormAutoConfig()
  }

  if (!pages?.length) {
    return
  }

  for (let i = 0; i < pages?.length; i++) {
    startPage(pages[i], i)
  }
}

export function setBounds(view: BrowserView) {
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

export function setAudioMuted(muted: boolean) {
  views.forEach(view => {
    view.webContents.setAudioMuted(muted)
  })
}
