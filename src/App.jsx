import { Navigate, Route, Routes } from 'react-router-dom'
import { DisplayHomePage } from './pages/DisplayHomePage.jsx'
import { GameDisplayPage } from './pages/GameDisplayPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DisplayHomePage />} />
      <Route path="/play/:gameCode" element={<GameDisplayPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  )
}

export default App
