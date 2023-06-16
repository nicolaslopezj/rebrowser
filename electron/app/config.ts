import Store from 'electron-store'

export interface Config {
  pages: {
    name: string
    startURL: string
    endpointURL: string
    endpointAuthenticationToken: string
  }[]
}

const store = new Store()

export async function setConfig(config: any) {
  store.set('pages', config)
}

export function getConfig() {
  const config = store.get('pages', {pages: []}) as Config
  return config
}
