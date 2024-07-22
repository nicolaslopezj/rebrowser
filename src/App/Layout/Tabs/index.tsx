import {
  ArrowPathIcon,
  CogIcon,
  GlobeAmericasIcon,
  HomeIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline'
/* eslint-disable react/style-prop-object */
import classNames from 'classnames'
import {Link, useLocation} from 'react-router-dom'
import {electronAPI} from '../../../api'
import TextButton from '../../../components/ui/buttons/TextButton'
import {useConfig} from '../../Config/types'
import {usePagesFavIcons, usePagesLoadings} from '../FaviconsContext'

export default function Tabs() {
  const location = useLocation()
  const {config, setConfig} = useConfig()
  const favIcons = usePagesFavIcons()
  const loadings = usePagesLoadings()

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
    <div className="flex h-10 space-x-2 border-b px-1">
      {tabs.length > 0 && (
        <Link
          to="/"
          className={classNames(
            'm-1 flex items-center justify-center rounded p-2 text-sm text-gray-600',
            {
              'bg-gray-200': isPathActive('/'),
              'bg-gray-100 hover:bg-gray-200': !isPathActive('/'),
            },
          )}
        >
          <div>
            <HomeIcon className="w-5" />
          </div>
        </Link>
      )}
      <div className="flex h-10 flex-1 space-x-2 overflow-auto py-1">
        {tabs.map((tab, index) => {
          const active = isPathActive(tab.path)
          const loading = loadings[index]
          return (
            <div
              key={index}
              className={classNames('group flex items-center justify-start rounded', {
                'bg-gray-200': active,
                'bg-gray-100': !active,
              })}
            >
              {loading ? (
                <div className="flex w-8 items-center justify-center p-2">
                  <TextButton
                    onClick={() => electronAPI.resetPage(index)}
                    style="light"
                    className="flex w-5 animate-spin items-center justify-center"
                  >
                    <ArrowPathIcon className="w-5" />
                  </TextButton>
                </div>
              ) : (
                <div className="flex w-8 items-center justify-center p-2">
                  <div className="w-5 group-hover:hidden">{tab.icon}</div>
                  <TextButton
                    onClick={() => electronAPI.resetPage(index)}
                    style="light"
                    className="hidden w-5 items-center justify-center group-hover:flex"
                  >
                    <ArrowPathIcon className="w-5" />
                  </TextButton>
                </div>
              )}
              <Link
                to={tab.path}
                className={classNames('rounded-lg p-2 text-sm text-gray-600', {
                  '': active,
                  'hover:bg-gray-200': !active,
                })}
              >
                <div className="flex-1 whitespace-nowrap">{tab.name}</div>
              </Link>
            </div>
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
          'm-1 flex items-center justify-center rounded p-2 text-sm text-gray-600',
          'bg-gray-100 hover:bg-gray-200',
        )}
      >
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
          'm-1 flex items-center justify-center rounded p-2 text-sm text-gray-600',
          {
            'bg-gray-200': isPathActive('/config'),
            'bg-gray-100 hover:bg-gray-200': !isPathActive('/config'),
          },
        )}
      >
        <div>
          <CogIcon className="w-5" />
        </div>
      </Link>
    </div>
  )
}
