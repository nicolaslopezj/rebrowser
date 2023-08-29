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
  pagesTitles: string[]
  pagesLoadings: boolean[]
  setPagesFavIcons: Dispatch<SetStateAction<string[]>>
}

export const InternalPagesFavIconsContext =
  createContext<PagesFavIconsContext>(null)

export function usePagesFavIcons() {
  const context = useContext(InternalPagesFavIconsContext)
  return context.pagesFavIcons || []
}

export function usePagesTitles() {
  const context = useContext(InternalPagesFavIconsContext)
  return context.pagesTitles || []
}

export function usePagesLoadings() {
  const context = useContext(InternalPagesFavIconsContext)
  return context.pagesLoadings || []
}

export function useCreateFavIconsContext(): PagesFavIconsContext {
  const [pagesFavIcons, setPagesFavIcons] = useState<string[]>([])
  const [pagesTitles, setPagesTitles] = useState<string[]>([])
  const [pagesLoadings, setPagesLoadings] = useState<boolean[]>([])

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

  useOnEvent('onPageTitleUpdated', (params: {index: number; title: string}) => {
    const {index, title} = params
    setPagesTitles(titles => {
      const newTitles = [...titles]
      newTitles[index] = title
      return newTitles
    })
  })

  useOnEvent('setPageLoading', (params: {index: number; loading: boolean}) => {
    const {index, loading} = params
    setPagesLoadings(loadings => {
      const newLoadings = [...loadings]
      newLoadings[index] = loading
      return newLoadings
    })
  })

  return {
    pagesFavIcons,
    pagesTitles,
    pagesLoadings,
    setPagesFavIcons,
  }
}
