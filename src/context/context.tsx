import { createContext, useState, useEffect } from "react";
import { Arquivo, ContextType, ProviderProps, Usuario } from "../models/types";

export const Context = createContext({} as ContextType);

const sampleArquivos: Arquivo[] = [
    { nome: 'Contrato', conteudo: null, criadoEm: new Date().toISOString(), ultima_modificacao: new Date().toISOString(), tamanho: 234567 },
    { nome: 'Fatura', conteudo: null, criadoEm: new Date().toISOString(), ultima_modificacao: new Date().toISOString(), tamanho: 120045 },
    { nome: 'Relatorio', conteudo: null, criadoEm: new Date().toISOString(), ultima_modificacao: new Date().toISOString(), tamanho: 54321 }
]

export function Provider({ children }: ProviderProps) {

    const [usuarioAtual, setUsuarioAtual] = useState<Usuario>({} as Usuario)

    // Usuario de teste para facilitar desenvolvimento/local
    const [usuarios, setUsuarios] = useState<Usuario[]>([
        { nome: 'Usuário de Teste', usuario: 'teste', senha: '1234' }
    ])

    // Arquivos mock para popular a listagem em desenvolvimento
    const [arquivos, setArquivos] = useState<Arquivo[]>(sampleArquivos)

    useEffect(() => {
        // Auto-login em ambiente dev: garante que a UI mostre o menu protegido
        const token = localStorage.getItem('token')
        if (!token) {
            localStorage.setItem('token', 'dev-token')
            localStorage.setItem('usuario', usuarios[0].usuario)
        }

        setUsuarioAtual(usuarios[0])
    }, [])

    return (
        <Context.Provider value={{ usuarioAtual, setUsuarioAtual, usuarios, setUsuarios, arquivos, setArquivos }}>
            {children}
        </Context.Provider>
    )

}