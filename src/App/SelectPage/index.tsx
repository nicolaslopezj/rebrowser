import {GlobeAmericasIcon} from '@heroicons/react/24/outline'
import {Link, Navigate} from 'react-router-dom'
import SpinnerLoading from '../../components/ui/loadings/Spinner'
import {useConfig} from '../Config/types'
import {usePagesFavIcons, usePagesTitles} from '../Layout/FaviconsContext'

export default function SelectATab() {
  const {config} = useConfig()
  const favIcons = usePagesFavIcons()
  const titles = usePagesTitles()

  if (!config) {
    return (
      <div className="flex items-center justify-center p-5">
        <SpinnerLoading />
      </div>
    )
  }

  if (config && config.pages.length === 0) {
    return <Navigate to="/config" />
  }

  return (
    <div className="space-y-2 p-2">
      <div className="text-lg font-bold">Open a tab</div>
      <div className="grid grid-cols-4 gap-2">
        {config.pages.map((page, index) => {
          return (
            <Link
              to={`/page/${index}`}
              key={index}
              className="space-y-2 rounded-md bg-gray-100 p-2 hover:bg-gray-200"
            >
              <div className="flex space-x-2">
                <div className="">
                  {favIcons[index] ? (
                    <img className="w-5" src={favIcons[index]} alt="" />
                  ) : (
                    <GlobeAmericasIcon className="w-4" />
                  )}
                </div>
                <div className="text-sm">{page.name}</div>
              </div>
              <div className="text-sm text-gray-500">{page.description}</div>
              <div className="truncate text-sm text-gray-500">{titles[index]}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
