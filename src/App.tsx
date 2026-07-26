import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Listagem from './pages/Listagem'
import Upload from './pages/Upload'
import { Provider } from './context/context'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <Provider>
      <Toaster richColors />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/arquivos" element={<Listagem />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Provider>
  )
}
