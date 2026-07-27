import { ChangeEvent, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import axios from 'axios'

import api from '../api/axios'
import { getUsuario } from '../api/auth'
import { Arquivo } from '../models/types'
import { Context } from '../context/context'

export default function Upload() {
  const navigate = useNavigate()
  const { usuarioAtual, usuarios } = useContext(Context)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<Arquivo>({
    defaultValues: {
      nome: '',
      conteudo: null
    }
  })
  const { nome, conteudo } = watch()

  const inputRef = useRef<HTMLInputElement>(null)

  function handleArquivo(e: ChangeEvent<HTMLInputElement>) {
    const arquivoSelecionado = e.target.files?.[0]
    if (!arquivoSelecionado) return

    if (arquivoSelecionado.type !== 'application/pdf') {
      toast.error('Selecione um arquivo em formato PDF.')
      return
    }

    setValue('conteudo', arquivoSelecionado)
    if (!nome) {
      setValue('nome', arquivoSelecionado.name.replace(/\.pdf$/i, ''))
    }
  }

  async function handleUpload() {
    if (!nome || !conteudo) {
      toast.error('Informe o nome do arquivo e selecione um PDF.')
      return
    }

    const usuarioId = usuarioAtual?.usuario || getUsuario() || usuarios[0]?.usuario

    if (!usuarioId) {
      toast.error('Faça login antes de enviar o arquivo.')
      return
    }

    const formData = new FormData()

    formData.append('nome', nome)
    formData.append('conteudo', conteudo)

    const nomeArquivo = `${nome}.pdf`

    try {
      const response = await api.put("/arquivos", {
        usuario_id: usuarioId,
        nome_arquivo: nomeArquivo
      })

      // log and expose presigned URL for easy local testing/copying
      // (the URL expires quickly — copy/use it immediately)
      // eslint-disable-next-line no-console
      console.log('presigned response:', response.data)

      const { url } = response.data

      // perform upload to presigned URL
      await axios.put(url, conteudo, {
        headers: {
          'Content-Type': 'application/pdf'
        }
      })

      toast.success('Upload realizado com sucesso!')
      setTimeout(() => navigate('/arquivos'), 1000)

    } catch (err) {
      toast.error('Falha ao enviar o arquivo. Tente novamente.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-8 shadow-glow">
          <h1 className="text-2xl font-bold text-gray-100 mb-1">Enviar PDF</h1>
          <p className="text-sm text-gray-500 mb-6">
            Dê um nome ao arquivo e selecione o PDF que deseja enviar.
          </p>

          <form onSubmit={handleSubmit(handleUpload)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Nome do arquivo
              </label>
              <input
                {...register("nome", { required: "O campo nome é obrigatório" })}
                type="text"
                placeholder="Ex: Contrato de prestação de serviço"
                className="w-full rounded-lg bg-dark-800 border border-dark-600 px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Arquivo PDF
              </label>
              <div
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-dark-600 hover:border-brand-500/60 bg-dark-800/60 px-4 py-8 text-center transition"
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleArquivo}
                  className="hidden"
                />
                {conteudo ? (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="h-7 w-7 rounded-md bg-accent-500/15 border border-accent-500/30 flex items-center justify-center text-accent-400 text-[10px] font-bold">
                      PDF
                    </span>
                    <span className="text-gray-200 font-medium">
                      {conteudo.name}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Clique para escolher um arquivo{' '}
                    <span className="text-brand-400">.pdf</span>
                  </p>
                )}
              </div>
            </div>

            {/* {isSubmitting && (
              <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-brand-500 to-accent-500 transition-all"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            )} */}

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
              {isSubmitting ? `Enviando...` : 'Enviar arquivo'}
            </button>

            <button
              className="w-full rounded-lg bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-60 text-white font-semibold py-2.5 transition shadow-glow"
            >
              <Link to="/arquivos">Cancelar</Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
