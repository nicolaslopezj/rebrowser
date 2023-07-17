import {Route, Routes} from 'react-router-dom'
import Layout from './Layout'
import ConfigIndex from './Config'
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
