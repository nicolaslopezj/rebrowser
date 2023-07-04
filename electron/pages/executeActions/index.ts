import {BrowserView} from 'electron'
import {RebrowserInstruction, RebrowserRequestResponse} from '../types'
import {makeRequest} from './makeRequest'
import axios from 'axios'
import {Config} from '../../app/config'
import {navigate} from './navigate'
import {reload} from './reload'
import {setLocalStorageItem} from './setLocalStorageItem'

export async function executeInstructions(
  index: number,
  view: BrowserView,
  instructions: RebrowserInstruction[]
) {
  for (const instruction of instructions) {
    try {
      for (const action of instruction.actions) {
        if (action.type === 'makeRequest') {
          await makeRequest(index, view, action)
        }
        if (action.type === 'navigate') {
          await navigate(index, view, action)
        }
        if (action.type === 'reload') {
          await reload(index, view, action)
        }
        if (action.type === 'wait') {
          await new Promise(resolve => setTimeout(resolve, action.duration))
        }
        if (action.type === 'setLocalStorageItem') {
          await setLocalStorageItem(index, view, action)
        }
      }
    } catch (error) {
      console.log(`Error while executing instruction: ${error}`)
    }
  }
}

export async function pollPendingInstructions(
  index: number,
  view: BrowserView,
  page: Config['pages'][0]
) {
  console.log(`Polling pending instructions for page ${page.name}`)
  const result = await axios<RebrowserRequestResponse>({
    url: page.endpointURL,
    method: 'get',
    headers: {
      Authorization: `Bearer ${page.endpointAuthenticationToken}`,
    },
  })
  if (result.data.instructions) {
    await executeInstructions(index, view, result.data.instructions)
  }
}
