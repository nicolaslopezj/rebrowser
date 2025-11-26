import crypto from 'crypto'
import axios from 'axios'
import dot from 'dot-object'
import {Config} from '../app/config'
import {RebrowserEventData, RebrowserRule, RebrowserRulesRequestResponse} from './types'

interface CachedRulesData {
  rules: RebrowserRule[]
  urlFilters: string[]
}

const cache = new Map<number, CachedRulesData>()

export async function getPageRules(
  page: Config['pages'][0],
  index: number,
): Promise<CachedRulesData> {
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
    console.log('Loaded rules', result.data.rules)
    console.log('Loaded urlFilters', result.data.urlFilters ?? [])

    const data: CachedRulesData = {
      rules: result.data.rules,
      urlFilters: result.data.urlFilters ?? [],
    }
    cache.set(index, data)
    return data
  } catch (error) {
    const emptyData: CachedRulesData = {rules: [], urlFilters: []}
    cache.set(index, emptyData)
    return emptyData
  }
}

const getJSON = (str: string) => {
  try {
    return JSON.parse(str)
  } catch (error) {}
}

function cleanValue(value: any) {
  const string = JSON.stringify(value)
  const hash = crypto.createHash('sha256')
  hash.update(string)
  return `filtered:${hash.digest('hex')}`
}

export async function filterData(
  page: Config['pages'][0],
  index: number,
  data: RebrowserEventData,
) {
  const {rules} = await getPageRules(page, index)
  const bodyJSON = getJSON(data.body)
  if (!bodyJSON) return null // only json bodies are passed

  for (const rule of rules) {
    const regex = new RegExp(rule.urlMatch)
    if (regex.test(data.url)) {
      if (rule.omit) {
        console.log(`Omit url ${data.url}`)
        return null
      }

      for (const filterParam of rule.filterJSONPaths || []) {
        try {
          // check if the value exists in the body
          const value = dot.pick(filterParam, bodyJSON)
          if (value) {
            // set the value to ***
            const value = dot.pick(filterParam, bodyJSON)
            const cleanedValue = cleanValue(value)
            dot.delete(filterParam, bodyJSON)
            dot.str(filterParam, cleanedValue, bodyJSON)
          }
        } catch (error) {
          console.log(`Error while filtering data for rule ${rule.urlMatch}: ${error}`)
        }
      }
    }
  }

  return {
    ...data,
    body: JSON.stringify(bodyJSON),
  }
}
