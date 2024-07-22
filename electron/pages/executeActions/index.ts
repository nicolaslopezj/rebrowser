import axios from 'axios'
import {views} from '..'
import {Config} from '../../app/config'
import {RebrowserInstruction, RebrowserRequestResponse} from '../types'
import {executeRequest} from './executeRequest'
import {executeScript} from './executeScript'
import {makeRequest} from './makeRequest'
import {navigate} from './navigate'
import {reload} from './reload'
import {reset} from './reset'
import {setLocalStorageItem} from './setLocalStorageItem'

export async function executeInstructions(
  index: number,
  instructions: RebrowserInstruction[],
  page: Config['pages'][0],
) {
  const view = views[index]
  for (const instruction of instructions) {
    try {
      for (const action of instruction.actions) {
        console.log('will execute instructions action', action)

        if (action.type === 'makeRequest') {
          await makeRequest(index, view, action)
        }
        if (action.type === 'executeRequest') {
          await executeRequest(index, page, view, action, instruction)
        }
        if (action.type === 'navigate') {
          await navigate(index, view, action)
        }
        if (action.type === 'reload') {
          await reload(index, view, action)
        }
        if (action.type === 'reset') {
          await reset(index, view, action, page)
        }
        if (action.type === 'wait') {
          await new Promise(resolve => setTimeout(resolve, action.duration))
        }
        if (action.type === 'setLocalStorageItem') {
          await setLocalStorageItem(index, view, action)
        }
        if (action.type === 'executeScript') {
          await executeScript(index, page, view, action, instruction)
        }
      }
    } catch (error) {
      console.log(`Error while executing instruction: ${error}`)
    }
  }
}

export async function pollPendingInstructions(index: number, page: Config['pages'][0]) {
  const result = await axios<RebrowserRequestResponse>({
    url: page.endpointURL,
    method: 'get',
    headers: {
      Authorization: `Bearer ${page.endpointAuthenticationToken}`,
    },
  })
  if (result.data.instructions?.length) {
    console.log('Will execute instructions', result.data)
    await executeInstructions(index, result.data.instructions, page)
  }
}
