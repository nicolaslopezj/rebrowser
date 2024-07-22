import {Route, Routes} from 'react-router-dom'
import ConfigIndex from './Config'
import Layout from './Layout'
import Page from './Page'
import SelectATab from './SelectPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/page/:pageIndex" element={<Page />} />
        <Route path="/config" element={<ConfigIndex />} />
        <Route path="*" element={<SelectATab />} />
      </Routes>
    </Layout>
  )
}
