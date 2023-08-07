import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import {useOnEvent} from 'react-app-events'

export interface PagesFavIconsContext {
  pagesFavIcons: string[]
  setPagesFavIcons: Dispatch<SetStateAction<string[]>>
}

export const InternalPagesFavIconsContext =
  createContext<PagesFavIconsContext>(null)

export function usePagesFavIcons() {
  const context = useContext(InternalPagesFavIconsContext)
  return context.pagesFavIcons || []
}

export function useCreateFavIconsContext(): PagesFavIconsContext {
  const [pagesFavIcons, setPagesFavIcons] = useState<string[]>([])

  useOnEvent(
    'onPageFaviconUpdated',
    (params: {index: number; imageURL: string}) => {
      const {index, imageURL} = params
      setPagesFavIcons(favIcons => {
        const newFavIcons = [...favIcons]
        newFavIcons[index] = imageURL
        return newFavIcons
      })
    }
  )

  return {
    pagesFavIcons,
    setPagesFavIcons,
  }
}
