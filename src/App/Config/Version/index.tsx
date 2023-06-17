import {useEffect, useState} from 'react'
import {electronAPI} from '../../../api'

export default function AppVersion() {
  const [version, setVersion] = useState<string>()
  useEffect(() => {
    electronAPI.getAppVersion().then(setVersion)
  }, [])

  if (!version) return null
  return (
    <div className="font-mono text-xs text-gray-500">Version {version}</div>
  )
}
