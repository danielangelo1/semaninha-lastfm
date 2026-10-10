<h1 align="center"> SEMANINHA </h1>

## 📖 Sobre

O Site **Semaninha** é um gerador de colagem dos albuns, artistas ou faixas mais escutados pelo usuário no **Last.fm**.

---

## 🚀 Tecnologias e ferramentas utilizadas

- **React** + **TypeScript**
- **Vite**
- **React Hook Form**
- **React Router**
- **Zod** (validação de env/schemas)
- **i18next** (pt/en)
- **Axios**
- **Phosphor Icons**
- **Vitest** + **Testing Library** + **MSW**
- **ESLint**
- **Sentry**
- **Vercel**

---

## 🖥️ Demonstração

<video src="docs/demo.mp4" controls width="600">
  Veja o vídeo em <a href="docs/demo.mp4">docs/demo.mp4</a>.
</video>

Você pode acessar o projeto clicando [aqui](https://www.semaninha.net/).

---

## 🔧 Como executar o projeto

```bash
# Clone o repositório
git clone https://github.com/danielangelo1/semaninha-lastfm

# Entre no diretório
cd semaninha-lastfm

# Instale as dependências
npm install
```

Crie um arquivo `.env` na raiz com sua chave da API do Last.fm:

```bash
VITE_API_KEY=sua_api_key_do_lastfm
VITE_LASTFM_URL=https://ws.audioscrobbler.com/2.0/
```

Depois, rode o projeto:

```bash
npm run dev
```

---

**Desenvolvido com 💛 por [Daniel Ângelo](https://github.com/danielangelo1/).**
