import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/Layout'
import {
  Dashboard,
  SearchPage,
  BooksPage,
  RecommendationsPage,
  GraphPage,
  CommunityPage,
  SettingsPage
} from './pages'

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
