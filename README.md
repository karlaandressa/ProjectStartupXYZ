# PDF Vault

App React + TypeScript (Vite) com 4 páginas:

- `/cadastro` — nome, usuário e senha
- `/login` — usuário e senha
- `/arquivos` — listagem de PDFs em tabela (rota protegida)
- `/upload` — envio de PDF com nome do arquivo (rota protegida)

**Stack:** React 19, react-router-dom 7, axios, Tailwind CSS 4 (via `@tailwindcss/vite`), TypeScript.

## Como rodar

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL para a sua API
npm run dev
```

O app sobe em `http://localhost:5173`.

## Sobre o Tailwind v4

Este projeto usa a instalação recomendada para Vite, sem `tailwind.config.js`
nem `postcss.config.js`:

```bash
npm install tailwindcss @tailwindcss/vite
```

O plugin é registrado direto no `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

E a paleta de cores (roxo/verde/escuro) é definida via `@theme` dentro do
próprio `src/index.css`, em vez de um arquivo de config JS:

```css
@import 'tailwindcss';

@theme {
  --color-dark-950: #0a0a12;
  --color-brand-500: #8b5cf6;
  --color-accent-500: #22c55e;
  /* ... */
}
```

Isso gera classes utilitárias como `bg-dark-950`, `text-brand-400`,
`border-accent-500` etc. automaticamente.

## Backend esperado

Este projeto é só o front-end. Ele espera uma API REST (ajuste
`VITE_API_URL` no `.env`):

| Método | Rota        | Body / Params                            | Resposta esperada                        |
|--------|-------------|-------------------------------------------|--------------------------------------------|
| POST   | `/register` | `{ nome, usuario, senha }`                 | `201` (ou `{ mensagem }` de erro)           |
| POST   | `/login`    | `{ usuario, senha }`                       | `{ token }`                                 |
| GET    | `/files`    | Header `Authorization: Bearer <token>`     | `[{ id, nome, criadoEm, tamanho, url }]`     |
| POST   | `/upload`   | `multipart/form-data` (`nome`, `arquivo`), header `Authorization` | `201` (arquivo criado) |

Se sua API usar nomes de campos diferentes, ajuste os tipos em `src/types.ts`
e as chamadas em `src/pages/*.tsx`.

O token é salvo em `localStorage` e anexado automaticamente pelo
interceptor em `src/api/axios.ts`. Se a API responder `401`, a sessão é
limpa e o usuário é redirecionado para `/login`.

## Estrutura

```
src/
  api/         axios.ts (cliente HTTP) e auth.ts (sessão)
  components/  Navbar.tsx, RotaPrivada.tsx
  pages/       Cadastro.tsx, Login.tsx, Listagem.tsx, Upload.tsx
  types.ts     tipos compartilhados (Arquivo, Sessao, ErroApi)
  App.tsx      rotas (react-router-dom v7)
  main.tsx     bootstrap do React
  index.css    Tailwind v4 + tokens de tema (@theme)
```
