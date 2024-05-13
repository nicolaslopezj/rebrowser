import axios from 'axios'
import {Config, getConfig} from '../app/config'

async function getAutoConfigFromString(autoConfigString: string, retries = 0) {
  const base64decoded = Buffer.from(autoConfigString, 'base64').toString(
    'utf-8',
  )
  const {url, token} = JSON.parse(base64decoded)

  try {
    const {data} = await axios<{pages: Config['pages']}>({
      url: url,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(data)

    return data.pages || []
  } catch (error) {
    console.error('Error getting auto config', error)
    if (retries < 5) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Retrying...')
      return getAutoConfigFromString(autoConfigString, retries + 1)
    }
    return []
  }
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
