import { useContext, useState } from 'react'
import api from '../api/axios'
import { Context } from '../context/context'

type buttonStatusType = {
    nomeArquivo: string
    handleErro: (erro: string) => void
}

export default function ButtonStatus({ nomeArquivo, handleErro }: buttonStatusType) {
    const { usuarioAtual } = useContext(Context)

    const [url, setUrl] = useState<string>('')

    async function buscaArquivoPorNome(usuario: string, nome: string) {
        const response = await api.get(`/arquivos/${nome}`, {
            headers: {
                "x-user-id": usuario,
            }
        })

        return response.data
    }

    async function acessaURL(nome: string) {
        handleErro('')
        try {
            const data = await buscaArquivoPorNome(usuarioAtual.usuario, nome);
            setUrl(data.url);
        } catch (error) {
            handleErro('Não foi possível cria o link do arquivo.')
        }
    }

    return (
        <>
            {url === '' ? (
                <a
                    className="text-blue-400 hover:text-accent-300 font-medium cursor-pointer"
                    onClick={() => acessaURL(nomeArquivo)}>Baixar</a>
            ) : (
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-400 hover:text-accent-300 font-medium cursor-pointer">Ver</a>
            )}
        </>
    )
}
