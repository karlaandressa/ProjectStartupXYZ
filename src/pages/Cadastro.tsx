import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

import { Context } from '../context/context'
import type { Usuario } from '../models/types'

export default function Cadastro() {
  const navigate = useNavigate()
  const { usuarios, setUsuarios } = useContext(Context)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Usuario>()

  async function cadastroUsuario({ nome, usuario, senha }: Usuario) {
    const usuarioDuplicado = usuarios.filter(u => { return u.usuario === usuario })

    if (usuarioDuplicado.length > 0) { throw new AxiosError("Usuário já cadastrado.") }

    await new Promise(resolve => setTimeout(resolve, 1200));
    setUsuarios([...usuarios, { nome, usuario, senha }])
  }

  async function handleRegister({ nome, usuario, senha }: Usuario) {
    try {
      await cadastroUsuario({ nome, usuario, senha });

      toast.success("Conta criada! Redirecionando para o login...")
      setTimeout(() => navigate('/login'), 1000)

    } catch (err) {
      const erroAxios = err as AxiosError

      toast.error(
        erroAxios?.message ||
        'Não foi possível criar a conta. Verifique as credenciais.'
      )
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-8 shadow-glow">
          <h1 className="text-2xl font-bold text-gray-100 mb-1">
            Criar conta
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Cadastre-se para enviar e gerenciar seus PDFs.
          </p>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Nome
              </label>
              <input
                {...register("nome", { required: "O campo nome é obrigatório" })}
                type="text"
                placeholder="Seu nome completo"
                className="w-full rounded-lg bg-dark-800 border border-dark-600 px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

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
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-accent-400 hover:text-accent-300 font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
