import os from 'os'
import axios from 'axios'
import {WebContentsView} from 'electron'
import {app} from 'electron'
import {executeInstructions} from '..'
import {Config} from '../../../app/config'
import {
  RebrowserAction,
  RebrowserEventData,
  RebrowserInstruction,
  RebrowserRequestResponse,
} from '../../types'
import {getFrame} from './getFrame'

export async function executeScript(
  index: number,
  page: Config['pages'][0],
  view: WebContentsView,
  action: RebrowserAction,
  instruction: RebrowserInstruction,
) {
  const {code, frame} = action
  const win = await getFrame(view, frame)
  if (!win) return

  console.log('will execute code', code)
  let executionResult: string
  let errorMessage: string

  try {
    const response = await win.executeJavaScript(code)
    console.log('response from script', response)
    executionResult = JSON.stringify(response)
  } catch (error) {
    console.log('error while executing script', error)
    errorMessage = JSON.stringify(error?.message || error || 'Unknown error')
  }
  const actionIndex = instruction.actions.indexOf(action)

  const data: RebrowserEventData = {
    version: app.getVersion(),
    arch: process.arch,
    device: `${os.type()} ${os.release()}`,
    url: `executeScript:${instruction._id}:${actionIndex}`,
    body: executionResult || errorMessage,
    requestBody: null,
    requestMethod: 'GET',
    status: errorMessage ? 500 : 200,
    page: page.name,
  }

  console.log(`Will send request to endpoint ${data.url}`)
  const result = await axios<RebrowserRequestResponse>({
    url: page.endpointURL,
    method: 'post',
    data,
    headers: {
      Authorization: `Bearer ${page.endpointAuthenticationToken}`,
    },
  })

  console.log(`Response from endpoint ${page.endpointURL}: ${JSON.stringify(result.data)}`)

  if (result.data.instructions) {
    await executeInstructions(index, result.data.instructions, page)
  }
}
