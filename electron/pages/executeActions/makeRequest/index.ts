import {WebContentsView} from 'electron'
import {getHistory} from '../../history'
import {RebrowserAction} from '../../types'
import {getFrame} from '../executeScript/getFrame'

export async function makeRequest(index: number, view: WebContentsView, action: RebrowserAction) {
  console.log(`Will make request ${JSON.stringify(action)}`)
  const headers = getHeaders(index, action) || {}

  for (const key in action.requestHeaders || {}) {
    const value = action.requestHeaders[key]
    if (value) {
      headers[key] = value
    } else {
      delete headers[key]
    }
  }

  const params = {
    method: action.requestMethod || 'GET',
    headers,
    body: action.requestBody || null,
  }
  const code = `fetch("${action.url}", ${JSON.stringify(params)})`

  console.log(`Will execute code ${code} - frame:${action.frame}`)

  const win = await getFrame(view, action.frame)
  await win.executeJavaScript(code)
}

export function getHeaders(index: number, action: RebrowserAction) {
  if (!action.takeHeadersFromRequestThatStartsWith) return {}

  const history = getHistory(index)

  for (let index = history.length - 1; index >= 0; index--) {
    const point = history[index]
    if (point.url.startsWith(action.takeHeadersFromRequestThatStartsWith)) {
      return point.headers
    }
  }

  throw new Error('No request found to take headers')
}
