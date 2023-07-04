import {useEffect, useState} from 'react'
import {electronAPI} from '../../../api'
import TextButton from '../../../components/ui/buttons/TextButton'
import {showNotification} from '../../../helpers/sendNotification'

export default function AppVersion() {
  const [version, setVersion] = useState<string>()
  useEffect(() => {
    electronAPI.getAppVersion().then(setVersion)
  }, [])

  if (!version) return null
  return (
    <div className="flex space-x-2 font-mono text-xs text-gray-500">
      <div>Version {version}.</div>
      <TextButton
        style="light"
        className=" text-xs"
        onClick={async () => {
          try {
            const result = await electronAPI.checkForUpdates()
            console.log(result)
            if (result?.updateInfo.version === version) {
              showNotification({
                title: 'No updates available',
                body: 'You are already using the latest version.',
              })
            } else {
              showNotification({
                title: 'Update available',
                body: 'Downloading update...',
              })
            }
          } catch (error) {
            showNotification({
              title: 'Error',
              body: error.message,
            })
          }
        }}>
        Check for updates
      </TextButton>
    </div>
  )
}
