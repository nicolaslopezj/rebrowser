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
import {getFrame} from '../executeScript/getFrame'
import {getHeaders} from '../makeRequest'

export async function executeRequest(
  index: number,
  page: Config['pages'][0],
  view: WebContentsView,
  action: RebrowserAction,
  instruction: RebrowserInstruction,
) {
  const {frame} = action
  const win = await getFrame(view, frame)
  if (!win) return

  console.log(`Will execute request ${JSON.stringify(action)}`)
  let executionResult: string
  let errorMessage: string
  let statusCode: number

  try {
    const headers = getHeaders(index, action) || {}

    for (const key in action.requestHeaders || {}) {
      const value = action.requestHeaders[key]
      if (value) {
        headers[key] = value
      } else {
        delete headers[key]
      }
    }

    const response = await axios({
      url: action.url,
      method: action.requestMethod || 'GET',
      headers,
      data: action.requestBody || null,
    })

    console.log('response from script', response.data)
    executionResult = JSON.stringify(response.data)
    statusCode = response.status || 200
  } catch (error) {
    console.log('error while executing script', error)
    errorMessage =
      error?.response?.data || JSON.stringify(error?.message || error || 'Unknown error')
    statusCode = error.response?.status || 500
  }
  const actionIndex = instruction.actions.indexOf(action)

  const data: RebrowserEventData = {
    version: app.getVersion(),
    arch: process.arch,
    device: `${os.type()} ${os.release()}`,
    url: `executeRequest:${instruction._id}:${actionIndex}`,
    body: executionResult || errorMessage,
    requestBody: null,
    requestMethod: action.requestMethod || 'GET',
    status: statusCode,
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
