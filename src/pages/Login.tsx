import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

import { saveSession } from '../api/auth'
import { Context } from '../context/context'
import type { Usuario } from '../models/types'

export default function Login() {
  const navigate = useNavigate()
  const { usuarios, setUsuarioAtual } = useContext(Context)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Usuario>()

  async function login({ usuario, senha }: Usuario) {
    const usuarioEncontrado = usuarios.filter(u => { return u.usuario === usuario })

    if (usuarioEncontrado.length === 0) { throw new AxiosError('Usuário incorreto.') }

    setUsuarioAtual(usuarioEncontrado[0])

    const senhasCombinam = usuarioEncontrado[0].senha === senha

    if (usuarioEncontrado && senhasCombinam) {
      const token = `${senha}${usuarioEncontrado[0].usuario}123`
      return { token }
    }

    throw new AxiosError('Senha incorreta.')
  }

  async function handleLogin({ usuario, senha }: Usuario) {
    try {
      const dados = await login({ usuario, senha })

      saveSession({ token: dados.token, usuario })

      toast.success('Usuário autenticado com sucesso!')
      navigate('/arquivos')

    } catch (err) {
      const erroAxios = err as AxiosError
      toast.error(
        erroAxios.message ||
        'Não foi possível logar na conta. Tente novamente.'
      )
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-8 shadow-glow">
          <h1 className="text-2xl font-bold text-gray-100 mb-1">Entrar</h1>
          <p className="text-sm text-gray-500 mb-6">
            Acesse sua conta para ver seus arquivos.
          </p>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Usuário
              </label>
              <input
                {...register("usuario", { required: "O campo usuário é obrigatório" })}
                type="text"
                placeholder="nome.usuario"
                className="w-full rounded-lg bg-dark-800 border border-dark-600 px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Senha
              </label>
              <input
                {...register("senha", { required: "O campo senha é obrigatório" })}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg bg-dark-800 border border-dark-600 px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            {
              Object.values(errors)[0]?.message && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {Object.values(errors)[0]?.message}
                </p>
              )
            }

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-linear-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-60 text-white font-semibold py-2.5 transition shadow-glow"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="text-accent-400 hover:text-accent-300 font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
