import {fireEvent} from 'react-app-events'
import {Config} from '../App/Config/types'

export interface ElectronAPI {
  restartApp: () => Promise<void>
  getConfig: () => Promise<Config>
  setConfig: (config: Partial<Config>) => Promise<void>
  showPage: (index: number) => Promise<void>
  hidePage: (index: number) => Promise<void>
  resetAllNavigationStorageAndCache: () => Promise<void>
  getAppVersion: () => Promise<string>
  checkForUpdates: () => Promise<any>
  testAutoConfigString: () => Promise<void>
  setAudioMuted: (muted: boolean) => Promise<void>

  onPageFaviconUpdated: (
    callback: (event: any, data: {index: number; imageURL: string}) => void
  ) => void
}

export const electronAPI = (window as any).electronAPI as ElectronAPI

electronAPI.onPageFaviconUpdated((event, data) => {
  console.log('onPageFaviconUpdated', data)
  fireEvent('onPageFaviconUpdated', data)
})
