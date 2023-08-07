import axios from 'axios'
import {Config} from '../app/config'
import {RebrowserEventData, RebrowserRequestResponse} from './types'
import {BrowserView, app} from 'electron'
import {addHistoryEntry} from './history'
import {executeInstructions} from './executeActions'
import {filterData} from './getRules'

export async function onRequestCompleted(
  index: number,
  view: BrowserView,
  page: Config['pages'][0],
  response: any,
  requestHeaders: any,
  body: string,
  requestBody?: string,
  requestMethod?: string
) {
  try {
    const data: RebrowserEventData = await filterData(page, index, {
      version: app.getVersion(),
      url: response.url,
      body: body,
      requestBody,
      requestMethod,
      status: response.status,
      page: page.name,
    })

    if (!data) return // data was filtered out

    addHistoryEntry(index, {
      ...data,
      headers: requestHeaders,
    })

    console.log(`Will send request to endpoint ${data.url}`)
    const result = await axios<RebrowserRequestResponse>({
      url: page.endpointURL,
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${page.endpointAuthenticationToken}`,
      },
    })

    console.log(
      `Response from endpoint ${page.endpointURL}: ${JSON.stringify(
        result.data
      )}`
    )

    if (result.data.instructions) {
      await executeInstructions(index, view, result.data.instructions, page)
    }
  } catch (error) {
    console.log(
      `Error while sending request to endpoint ${page.endpointURL}: ${error}`
    )
  }
}
