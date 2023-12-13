import {useLocalStorage} from '../../hooks/state/useLocalStorage'
import {
  InternalPagesFavIconsContext,
  useCreateFavIconsContext,
} from './FaviconsContext'
import SignTOS from './SignTOS'
import Tabs from './Tabs'

export interface Props {
  children: React.ReactNode
}
export default function Layout(props: Props) {
  const context = useCreateFavIconsContext()
  const [didSign, setDidSign] = useLocalStorage('didSignTOS.v2', false)
  if (!didSign) {
    return <SignTOS setDidSign={setDidSign} />
  }
  return (
    <InternalPagesFavIconsContext.Provider value={context}>
      <div className="flex h-screen flex-col">
        <Tabs />
        {props.children}
      </div>
    </InternalPagesFavIconsContext.Provider>
  )
}
