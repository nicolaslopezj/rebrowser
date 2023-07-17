import classNames from 'classnames'
import {Link, useLocation} from 'react-router-dom'
import {useConfig} from '../../Config/types'
import {
  CogIcon,
  GlobeAmericasIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline'
import {Fragment, useState} from 'react'
import {useOnEvent} from 'react-app-events'
import {electronAPI} from '../../../api'

export default function Tabs() {
  const location = useLocation()
  const {config, setConfig} = useConfig()
  const [favIcons, setFavIcons] = useState<string[]>([])

  useOnEvent(
    'onPageFaviconUpdated',
    (params: {index: number; imageURL: string}) => {
      const {index, imageURL} = params
      setFavIcons(favIcons => {
        const newFavIcons = [...favIcons]
        newFavIcons[index] = imageURL
        return newFavIcons
      })
    }
  )

  // if (!config) return null

  const tabs = [
    ...(config?.pages?.map((page, index) => ({
      name: (
        <div className="flex items-center space-x-2">
          {favIcons[index] ? (
            <img className="w-5" src={favIcons[index]} alt="" />
          ) : (
            <GlobeAmericasIcon className="w-4" />
          )}
          <div>{page.name}</div>
        </div>
      ),
      path: `/page/${index}`,
      onClick: null,
    })) || []),
    {
      name: (
        <div>
          {config?.muteAudio ? (
            <SpeakerXMarkIcon className="w-4" />
          ) : (
            <SpeakerWaveIcon className="w-4" />
          )}
        </div>
      ),
      path: null,
      onClick: () => {
        const muteAudio = !config?.muteAudio
        setConfig({...config, muteAudio})
        electronAPI.setAudioMuted(muteAudio)
      },
    },
    {
      name: (
        <div>
          <CogIcon className="w-5" />
        </div>
      ),
      path: '/config',
      onClick: null,
    },
  ]

  return (
    <div className="flex h-10 space-x-2 border-b p-1 px-2">
      {tabs.map((tab, index) => {
        const active = location.pathname === tab.path
        return (
          <Fragment key={index}>
            {index === tabs.length - 2 && <div className="flex-1"></div>}
            {tab.path ? (
              <Link
                to={tab.path}
                className={classNames(
                  'flex items-center justify-center rounded p-2 text-sm text-gray-600',
                  {
                    'bg-gray-200': active,
                    'bg-gray-100 hover:bg-gray-200': !active,
                  }
                )}>
                {tab.name}
              </Link>
            ) : (
              <button
                className={classNames(
                  'flex items-center justify-center rounded p-2 text-sm text-gray-600',
                  {
                    'bg-gray-200': active,
                    'bg-gray-100 hover:bg-gray-200': !active,
                  }
                )}
                onClick={tab.onClick}>
                {tab.name}
              </button>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
