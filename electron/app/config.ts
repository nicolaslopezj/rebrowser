import Store from 'electron-store'
import {getPagesFormAutoConfig} from '../pages/getPagesFromAutoConfig'

export interface Config {
  autoConfigString?: string
  muteAudio?: boolean
  pages: {
    name: string
    description?: string
    startURL: string
    endpointURL: string
    endpointAuthenticationToken: string
    partition?: string
  }[]
}

const store = new Store<{
  pages: Config
}>({
  defaults: {
    pages: {
      pages: [],
      autoConfigString: null,
    },
  },
})

export async function setConfig(config: Config) {
  store.set('pages', config)
}

export function getConfig() {
  const config = store.get('pages')
  return (
    config || {
      pages: [],
    }
  )
}

export async function getConfigWithAutoConfig() {
  const config = store.get('pages')
  if (!config.autoConfigString) return config

  return {
    ...config,
    pages: await getPagesFormAutoConfig(),
  }
}

export async function testAutoConfigString() {
  await getPagesFormAutoConfig()
}
