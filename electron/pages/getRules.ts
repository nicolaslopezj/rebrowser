import axios from 'axios'
import {
  RebrowserEventData,
  RebrowserRule,
  RebrowserRulesRequestResponse,
} from './types'
import {Config} from '../app/config'
import dot from 'dot-object'

const cache = new Map<number, RebrowserRule[]>()

export async function getPageRules(
  page: Config['pages'][0],
  index: number
): Promise<RebrowserRule[]> {
  const cached = cache.get(index)
  if (cached) {
    return cached
  }

  try {
    const result = await axios<RebrowserRulesRequestResponse>({
      url: `${page.endpointURL}/rules`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${page.endpointAuthenticationToken}`,
      },
    })
    cache.set(index, result.data.rules)
    return result.data.rules
  } catch (error) {
    cache.set(index, [])

    return []
  }
}

const getJSON = (str: string) => {
  try {
    return JSON.parse(str)
  } catch (error) {}
}

export async function filterData(
  page: Config['pages'][0],
  index: number,
  data: RebrowserEventData
) {
  const rules = await getPageRules(page, index)
  const bodyJSON = getJSON(data.body)
  if (!bodyJSON) return null // only json bodies are passed

  for (const rule of rules) {
    const regex = new RegExp(rule.urlMatch)
    if (regex.test(data.url)) {
      if (rule.omit) {
        return null
      }

      for (const filterParam of rule.filterJSONPaths || []) {
        try {
          // check if the value exists in the body
          const value = dot.pick(filterParam, bodyJSON)
          if (value) {
            // set the value to ***
            dot.delete(filterParam, bodyJSON)
            dot.str(filterParam, '***', bodyJSON)
          }
        } catch (error) {
          console.log(
            `Error while filtering data for rule ${rule.urlMatch}: ${error}`
          )
        }
      }
    }
  }

  return {
    ...data,
    body: JSON.stringify(bodyJSON),
  }
}
