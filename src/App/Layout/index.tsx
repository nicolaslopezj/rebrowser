import {
  InternalPagesFavIconsContext,
  useCreateFavIconsContext,
} from './FaviconsContext'
import Tabs from './Tabs'

export interface Props {
  children: React.ReactNode
}
export default function Layout(props: Props) {
  const context = useCreateFavIconsContext()
  return (
    <InternalPagesFavIconsContext.Provider value={context}>
      <div className="flex h-screen flex-col">
        <Tabs />
        {props.children}
      </div>
    </InternalPagesFavIconsContext.Provider>
  )
}
