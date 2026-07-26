import { ReactNode } from "react";

export interface Arquivo {
  nome: string
  conteudo: File | null
  criadoEm?: string
  ultima_modificacao: string
  tamanho?: number
  caminho?: string
}

export interface Sessao {
  token: string
  usuario?: string
}

export type Usuario = {
  nome?: string;
  usuario: string;
  senha: string;
}

export type ContextType = {
  usuarioAtual: Usuario
  usuarios: Usuario[]
  arquivos: Arquivo[]

  setUsuarioAtual: (usuario: Usuario) => void
  setUsuarios: (usuarios: Usuario[]) => void
  setArquivos: (arquivos: Arquivo[]) => void
}

export interface ProviderProps {
  children: ReactNode;
}

export interface LoginResposta {
  token: string
}
