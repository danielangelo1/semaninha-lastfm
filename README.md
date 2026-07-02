<h1 align="center"> SEMANINHA </h1>

## 📖 Sobre

O **Semaninha** é um gerador de colagens dos álbuns, artistas e músicas mais escutados pelo usuário no **Last.fm**. Escolha o período, o tamanho da grade e baixe a imagem pronta para compartilhar.

Acesse em produção: [semaninha.net](https://www.semaninha.net/)

## 🚀 Tecnologias

- **React 18** + **TypeScript** + **Vite**
- **React Hook Form**, **React Router**, **React Toastify**
- **i18next** (pt/en), **Zod**, **Axios**, **Sentry**
- **Vitest** + Testing Library + **MSW**
- **Vercel** (hosting + serverless function para autenticação no Spotify)
- APIs: **Last.fm** (dados) e **Spotify** (imagens de artistas)

## 🖥️ Demonstração

https://user-images.githubusercontent.com/84107769/233744746-765e816b-ef9b-4f62-969d-b49b7f5276e9.mp4

## 🔧 Como executar

Pré-requisitos: Node.js 20+ e npm.

```bash
# Clone o repositório e entre no diretório
git clone https://github.com/danielangelo1/semaninha-lastfm
cd semaninha-lastfm

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com a sua API key do Last.fm

# Rode em desenvolvimento
npm run dev
```

> **Imagens de artistas (Spotify):** a autenticação no Spotify roda numa
> serverless function (`api/spotify-token.ts`), que não é servida pelo
> `npm run dev`. Para testar o fluxo completo localmente use
> [`vercel dev`](https://vercel.com/docs/cli/dev) com `SPOTIFY_CLIENT_ID` e
> `SPOTIFY_CLIENT_SECRET` no `.env`. Sem isso, colagens de artistas degradam
> para células com placeholder — álbuns e músicas funcionam normalmente.

## 📜 Scripts

| Script                  | Descrição                                    |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento (Vite)           |
| `npm run build`         | Build de produção (tsc + Vite)               |
| `npm run preview`       | Preview do build                             |
| `npm test`              | Testes em watch mode (Vitest)                |
| `npm run test:run`      | Testes uma vez (CI)                          |
| `npm run test:coverage` | Testes com cobertura                         |
| `npm run lint`          | ESLint                                       |
| `npm run format`        | Prettier (escreve)                           |
| `npm run type-check`    | Checagem de tipos                            |
| `npm run ci`            | lint + format:check + type-check + build     |

## 📁 Estrutura

```
api/            Serverless function da Vercel (token do Spotify)
config/         Configs de Vite, TypeScript e ESLint
src/
  components/   Canvas, UserInput, Header, Footer, ...
  hooks/        useLastFmData, useLocalStorage, ...
  services/     LastFMService, SpotifyService, api (axios)
  utils/        generateCanvas, canvasUtils, FontHandler
  i18n/         Traduções pt/en
  pages/        Home, Privacy
tests/          Setup, mocks (MSW) e testes de integração
```

## ☁️ Deploy (Vercel)

O deploy é feito automaticamente pela integração da Vercel. Variáveis de
ambiente necessárias no dashboard:

| Variável                | Escopo                                    |
| ----------------------- | ----------------------------------------- |
| `VITE_API_KEY`          | Build (API key do Last.fm)                |
| `VITE_LASTFM_URL`       | Build (`https://ws.audioscrobbler.com/2.0/`) |
| `SPOTIFY_CLIENT_ID`     | Runtime da function (server-side)         |
| `SPOTIFY_CLIENT_SECRET` | Runtime da function (server-side)         |

---

**Desenvolvido com 💛 por [Daniel Ângelo](https://github.com/danielangelo1/).**
