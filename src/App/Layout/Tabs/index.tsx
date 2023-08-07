import classNames from 'classnames'
import {Link, useLocation} from 'react-router-dom'
import {useConfig} from '../../Config/types'
import {
  CogIcon,
  GlobeAmericasIcon,
  HomeIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline'
import {electronAPI} from '../../../api'
import {usePagesFavIcons} from '../FaviconsContext'

export default function Tabs() {
  const location = useLocation()
  const {config, setConfig} = useConfig()
  const favIcons = usePagesFavIcons()

  const tabs =
    config?.pages?.map((page, index) => ({
      name: page.name,
      icon: favIcons[index] ? (
        <img className="w-5" src={favIcons[index]} alt="" />
      ) : (
        <GlobeAmericasIcon className="w-4" />
      ),
      path: `/page/${index}`,
      onClick: null,
    })) || []

  const isPathActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="flex h-10 space-x-2 border-b p-1 px-2">
      {tabs.length > 0 && (
        <Link
          to="/"
          className={classNames(
            'flex items-center justify-center rounded p-2 text-sm text-gray-600',
            {
              'bg-gray-200': isPathActive('/'),
              'bg-gray-100 hover:bg-gray-200': !isPathActive('/'),
            }
          )}>
          <div>
            <HomeIcon className="w-5" />
          </div>
        </Link>
      )}
      <div className="flex flex-1 space-x-2 overflow-auto">
        {tabs.map((tab, index) => {
          const active = isPathActive(tab.path)
          return (
            <Link
              key={index}
              to={tab.path}
              className={classNames(
                'flex items-center justify-start space-x-2 rounded p-2 text-sm text-gray-600',
                {
                  'bg-gray-200': active,
                  'bg-gray-100 hover:bg-gray-200': !active,
                }
              )}>
              <div className="w-5">{tab.icon}</div>
              <div className="flex-1 whitespace-nowrap">{tab.name}</div>
            </Link>
          )
        })}
      </div>
      <button
        onClick={() => {
          const muteAudio = !config?.muteAudio
          setConfig({...config, muteAudio})
          electronAPI.setAudioMuted(muteAudio)
        }}
        className={classNames(
          'flex items-center justify-center rounded p-2 text-sm text-gray-600',
          'bg-gray-100 hover:bg-gray-200'
        )}>
        <div>
          {config?.muteAudio ? (
            <SpeakerXMarkIcon className="w-4" />
          ) : (
            <SpeakerWaveIcon className="w-4" />
          )}
        </div>
      </button>
      <Link
        to="/config"
        className={classNames(
          'flex items-center justify-center rounded p-2 text-sm text-gray-600',
          {
            'bg-gray-200': isPathActive('/config'),
            'bg-gray-100 hover:bg-gray-200': !isPathActive('/config'),
          }
        )}>
        <div>
          <CogIcon className="w-5" />
        </div>
      </Link>
    </div>
  )
}
