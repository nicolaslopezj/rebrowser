import axios from 'axios'
import {Config, getConfig} from '../app/config'

async function getAutoConfigFromString(autoConfigString: string) {
  const base64decoded = Buffer.from(autoConfigString, 'base64').toString(
    'utf-8',
  )
  const {url, token} = JSON.parse(base64decoded)

  const {data} = await axios<{pages: Config['pages']}>({
    url: url,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  console.log(data)

  return data.pages || []
}

export async function getPagesFormAutoConfig(): Promise<Config['pages']> {
  try {
    const config = getConfig()
    if (!config?.autoConfigString) {
      throw new Error('No autoConfigString found in config')
    }

    const strings = config.autoConfigString.split(',')

    const pages = []
    for (const string of strings) {
      const pagesFromAutoConfig = await getAutoConfigFromString(string)
      pages.push(...pagesFromAutoConfig)
    }

    return pages
  } catch (error) {
    console.error(error)
    return []
  }
}
