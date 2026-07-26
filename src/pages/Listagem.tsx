import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { Context } from '../context/context'
import { formatarData, formatarTamanho } from '../lib/utils'
import ButtonStatus from '../components/button-status'

export default function Listagem() {
  const { arquivos, setArquivos, usuarioAtual } = useContext(Context)

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function listarArquivos(usuario: string) {
    const response = await api.get("/arquivos/listar", {
      headers: {
        "x-user-id": usuario,
      }
    })

    return response.data
  }

  async function buscarArquivos() {
    setCarregando(true)
    setErro('')
    try {

      const data = await listarArquivos(usuarioAtual.usuario);
      // API may return { arquivos: [...] } or an array directly or a single-object response.
      let list = data?.arquivos ?? data ?? []

      if (!Array.isArray(list)) {
        // try common container keys
        const possible = data?.arquivos ?? data?.files ?? data?.data ?? null
        list = Array.isArray(possible) ? possible : []
      }

      setArquivos(list)

    } catch {
      setErro('Não foi possível carregar os arquivos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarArquivos()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Meus arquivos</h1>
          <p className="text-sm text-gray-500 mt-1">
            PDFs enviados para a sua conta.
          </p>
        </div>
        <Link
          to="/upload"
          className="rounded-lg bg-linear-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-dark-950 font-semibold px-4 py-2.5 text-sm transition"
        >
          + Enviar PDF
        </Link>
      </div>

      <div className="bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden">
        {carregando ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            Carregando arquivos...
          </div>
        ) : erro ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-400 mb-3">{erro}</p>
            <button
              onClick={buscarArquivos}
              className="text-sm text-brand-400 hover:text-brand-300 font-medium"
            >
              Tentar novamente
            </button>
          </div>
        ) : arquivos.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            Nenhum arquivo enviado ainda.{' '}
            <Link to="/upload" className="text-accent-400 hover:text-accent-300">
              Envie o primeiro PDF
            </Link>
            .
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700 text-left text-gray-400">
                <th className="px-5 py-3 font-medium">Nome do arquivo</th>
                <th className="px-5 py-3 font-medium">Enviado em</th>
                <th className="px-5 py-3 font-medium">Tamanho</th>
                <th className="px-5 py-3 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {arquivos.map((arquivo) => (
                <tr
                    key={arquivo.nome + usuarioAtual.usuario}
                  className="border-b border-dark-800 last:border-0 hover:bg-dark-800/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="h-8 w-8 rounded-md bg-brand-600/15 border border-brand-600/30 flex items-center justify-center text-brand-400 text-xs font-bold shrink-0">
                        PDF
                      </span>
                      <span className="text-gray-100 font-medium">
                        {arquivo.nome}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {formatarData(arquivo.criadoEm || arquivo.ultima_modificacao)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {formatarTamanho(arquivo.tamanho)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ButtonStatus nomeArquivo={arquivo.nome} handleErro={setErro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div >
  )
}
