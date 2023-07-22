import axios from 'axios'
import {Config, getConfig} from '../app/config'

export async function getPagesFormAutoConfig() {
  try {
    const config = getConfig()
    if (!config?.autoConfigString) {
      throw new Error('No autoConfigString found in config')
    }

    const base64decoded = Buffer.from(
      config.autoConfigString,
      'base64'
    ).toString('utf-8')
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
  } catch (error) {
    console.error(error)
    return []
  }
}
