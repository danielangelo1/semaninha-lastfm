# Copilot instructions — Semaninha (Last.fm)

Semaninha gera colagens/imagens (grid e "Wrapped") a partir dos dados de escuta do
usuário no Last.fm. Stack: React 18 + TypeScript + Vite, react-hook-form, React
Router v6, i18next (pt/en), Zod (validação de env), Sentry, Vitest 4 + Testing
Library + MSW, ESLint 9 (flat config) + Prettier. Configs de build/lint/test ficam
em `config/`, não na raiz. Deploy é na Vercel, com funções serverless em `api/`
(proxy do Last.fm e emissão de token do Spotify).

## Convenções de arquitetura (revisar com atenção)

- **`src/services/`** deve conter só chamadas de API/rede (axios, `fetch`) e
  orquestração mínima em torno delas. Nada de manipulação de DOM/Canvas, layout,
  ou lógica de renderização aqui.
- **`src/utils/`** concentra lógica pura e renderização de Canvas (ex.:
  `canvasUtils.ts`, `generateCanvas.ts`, `generateWrappedCanvas.ts`). Funções de
  formatação/normalização puras (sem I/O) também pertencem aqui ou em
  `src/helpers/`, não dentro de um service.
- **`src/helpers/`** guarda helpers estáticos ligados a um domínio específico
  (ex.: `ServicesHelper.buildLastFmUrl`, `SpotifyHelper.formatArtistName`) —
  siga o padrão de classe com métodos `static` já usado nesses arquivos.
- Estado mutável de módulo (cache de token, singletons) deve ficar isolado em
  seu próprio arquivo (ex.: `spotifyAuth.ts`), nunca misturado com as funções de
  service que fazem as chamadas de negócio.
- Segredos de servidor (`LASTFM_API_KEY`, `SPOTIFY_CLIENT_ID/SECRET`) só devem
  ser referenciados em `api/` (serverless) ou `src/config/env.ts`. Nunca commitar
  chave/segredo hardcoded.

## O que sinalizar em um PR review

1. **Vazamento de camada**: chamada de API dentro de componente/página em vez de
   `src/services/`; lógica de Canvas/DOM dentro de `src/services/`; lógica de
   negócio dentro de `src/helpers/`.
2. **Erros silenciosos**: `catch` que engole erro sem `console.error`/Sentry ou
   sem propagar mensagem útil (o projeto usa `ERROR_MESSAGES` em
   `src/constants/`) — prefira reusar essas mensagens a strings soltas.
3. **Duplicação**: nova função de `loadImage`/desenho de canvas quando já existe
   equivalente em `src/utils/canvasUtils.ts`.
4. **Cache/estado global**: novo estado de módulo mutável fora de um arquivo
   dedicado (padrão `spotifyAuth.ts`), especialmente sem expiração/limite.
5. **i18n**: strings de UI visíveis ao usuário sem passar por `i18next`
   (arquivos em `src/i18n/locales`), quando o texto ao redor já é traduzido.
6. **Tipagem**: uso de `any` fora dos poucos casos já existentes (o repo trata
   isso como warning, não erro — não bloqueie por isso, mas comente).
7. **Testes**: mudanças em `src/services/`, `src/utils/` ou `src/hooks/` sem
   teste correspondente em `__tests__/` quando o arquivo já tinha cobertura.
8. **Feature "Wrapped" desativada**: não remover código/rotas do Wrapped
   silenciosamente — a feature está propositalmente dormente; confirmar com o
   autor antes de sugerir remoção total.

## Antes de aprovar

O CI (`.github/workflows/ci.yml` e `test.yml`) roda `npm run lint`,
`npm run type-check` e `npm run test:run` — sinalize qualquer mudança que
provavelmente quebre um desses (ex.: import quebrado, tipo incompatível, novo
`console.log` residual) mesmo que o PR não rode o pipeline ainda.
