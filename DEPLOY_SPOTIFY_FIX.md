# TODO temporário — deploy do fix do 403 do Spotify

> Arquivo temporário, não faz parte da documentação do projeto. Pode apagar depois de concluir os passos.

Contexto: a chamada de client-credentials do Spotify foi movida do browser para uma
serverless function (`api/spotify-token.ts`). Isso só funciona em produção se as env
vars abaixo estiverem configuradas na Vercel.

## 1. Commitar e dar push

As mudanças ainda estão só no working tree. Revisar o diff e commitar antes de abrir PR/mergear:

```bash
git status
git add api/ src/ tests/ config/tsconfig.app.json vercel.json package.json package-lock.json
git commit -m "fix(spotify): mover client-credentials para serverless function"
```

## 2. Pegar as credenciais no Spotify

1. Acessar https://developer.spotify.com/dashboard
2. Abrir o app existente (ou criar um novo)
3. Copiar **Client ID** e **Client Secret** (em "Settings" do app)

## 3. Configurar env vars na Vercel

No dashboard do projeto → **Settings → Environment Variables**, adicionar (em Production
e Preview):

| Nome                   | Valor                              | Observação                                  |
| ---------------------- | ----------------------------------- | -------------------------------------------- |
| `SPOTIFY_CLIENT_ID`     | Client ID do passo 2                | **sem** prefixo `VITE_` — só o backend lê     |
| `SPOTIFY_CLIENT_SECRET` | Client Secret do passo 2            | **sem** prefixo `VITE_` — nunca vai pro bundle |
| `VITE_API_KEY`          | API key do Last.fm                  | já deve existir — confirmar que está setada  |
| `VITE_LASTFM_URL`       | `http://ws.audioscrobbler.com/2.0/` | já deve existir — confirmar que está setada  |

- `VITE_SPOTIFY_URL` e `VITE_MUSICBRAINZ_URL` são opcionais (têm default no código),
  não precisa setar.
- Se existirem `VITE_SPOTIFY_CLIENT_ID` / `VITE_SPOTIFY_CLIENT_SECRET` no dashboard
  (do fluxo antigo), **remover** — não são mais lidas e só expõem segredo à toa.

## 4. Redeploy

Mudança de env var não aplica em deployments já existentes — depois de salvar, disparar
um novo deploy (push de um commit, ou "Redeploy" no dashboard da Vercel).

## 5. Testar local antes de confiar no deploy (opcional, recomendado)

`npm run dev` sozinho não serve `/api/*`. Usar a CLI da Vercel:

```bash
# no .env local, adicionar (sem prefixo VITE_):
# SPOTIFY_CLIENT_ID=...
# SPOTIFY_CLIENT_SECRET=...

vercel dev
```

Gerar uma colagem e confirmar que as imagens de artista aparecem (sem células
pretas/placeholder) e que não há 403 no console/network.

## 6. Smoke test em produção

Depois do redeploy:

- Gerar uma colagem com vários artistas e confirmar que as imagens do Spotify carregam
- Se alguma célula vier vazia, checar os logs da function `api/spotify-token` no
  dashboard da Vercel (aba "Functions" / "Logs") — 500 = env var faltando, 502 = Spotify
  recusou as credenciais (client id/secret errados ou revogados)

## Fora do escopo deste fix (ciente, não bloqueia o deploy)

A chave do Last.fm (`VITE_API_KEY`) ainda é lida no browser (continua exposta no bundle).
A migração dela para um proxy serverless (`api/lastfm.ts`) já existe na branch
`feat/project-improvements`, mas não foi trazida para a `main` neste fix — é um
problema separado, não causa o 403 do Spotify.
