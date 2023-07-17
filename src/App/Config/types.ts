import {useEffect, useState} from 'react'
import {electronAPI} from '../../api'
import {isEqual} from 'lodash'

export interface Config {
  autoConfigString?: string
  muteAudio?: boolean
  pages: {
    name: string
    startURL: string
    endpointURL: string
    endpointAuthenticationToken: string
  }[]
}

export function useConfig() {
  const [config, setConfigState] = useState<Config>()

  useEffect(() => {
    electronAPI.getConfig().then(config => {
      if (!config?.pages) return
      setConfigState(config)
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
