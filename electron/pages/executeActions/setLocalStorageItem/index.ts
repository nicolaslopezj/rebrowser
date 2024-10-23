import {WebContentsView} from 'electron'
import {RebrowserAction} from '../../types'

export async function setLocalStorageItem(
  index: number,
  view: WebContentsView,
  action: RebrowserAction,
) {
  console.log(`Will setLocalStorageItem ${JSON.stringify(action)}`)
  const key = action.localStorageKey
  const escapedValue = JSON.stringify(action.localStorageValue)
  const code = `window.localStorage.setItem(${JSON.stringify(key)}, ${escapedValue});
  `

  console.log(`Executing code: ${code}`)

  await view.webContents.executeJavaScript(code)
}
