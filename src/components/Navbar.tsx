import { toast } from 'sonner'
import { useContext } from 'react'
import { Context } from '../context/context'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearSession, getUsuario, isAuthenticated } from '../api/auth'
import { Usuario } from '../models/types'

export default function Navbar() {
  const navigate = useNavigate()
  const autenticado = isAuthenticated()
  const { setUsuarioAtual } = useContext(Context)

  function sair() {
    setUsuarioAtual({} as Usuario)
    clearSession()
    navigate('/login')
    toast.info("Deslogado com sucesso.")
  }

  const linkClasse = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
      ? 'bg-brand-600/20 text-brand-400 border border-brand-600/40'
      : 'text-gray-400 hover:text-gray-100 hover:bg-dark-800 border border-transparent'
    }`

  return (
    <header className="border-b border-dark-700 bg-dark-900/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">

          <div className='h-8 w-8 rounded-lg'>
            <img src="/favicon.svg" />
          </div>

          <span className="font-semibold tracking-tight">
            Startup XYZ
          </span>
        </div>

        {autenticado && (
          <nav className="flex items-center gap-2">
            <NavLink to="/arquivos" className={linkClasse}>
              Arquivos
            </NavLink>
            <NavLink to="/upload" className={linkClasse}>
              Enviar PDF
            </NavLink>
            <span className="hidden sm:inline text-xs text-gray-500 ml-2">
              {getUsuario()}
            </span>
            <button
              onClick={sair}
              className="ml-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-dark-800 transition-colors"
            >
              Sair
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
