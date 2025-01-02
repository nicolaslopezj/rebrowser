import {useEffect, useState} from 'react'
import {electronAPI} from '../../api'

export interface Config {
  autoConfigString?: string
  muteAudio?: boolean
  pages: {
    name: string
    description?: string
    startURL: string
    endpointURL: string
    endpointAuthenticationToken: string
  }[]
}

export function useConfig() {
  const [config, setConfigState] = useState<Config>()

  useEffect(() => {
    electronAPI
      .getConfig()
      .then(config => {
        if (!config?.pages) {
          setConfigState({
            pages: [],
          })
        } else {
          setConfigState(config)
        }
      })
      .catch(error => {
        console.error('Error getting config', error)
        setConfigState({
          pages: [],
        })
      })
  }, [])

  const setConfig = (config: Config) => {
    setConfigState(config)
    electronAPI.setConfig(config)
  }

  return {config, setConfig}
}

export function usePageConfig(index: string) {
  const {config} = useConfig()

  if (!config) return null

  return config.pages[Number(index)]
}
