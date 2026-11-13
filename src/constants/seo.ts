import { WRAPPED_YEAR } from './wrapped';

// The apex domain redirects here, so canonical URLs must use www
export const SITE_URL = 'https://www.semaninha.net';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
}

// Every page listed here is prerendered at build time and goes into the sitemap.
// When the seasonal Wrapped route is turned off, remove its entry too.
export const PAGE_META: PageMeta[] = [
  {
    path: '/',
    title: 'Gerador de Semaninha - Colagem Last.fm',
    description:
      'Crie colagens personalizadas dos seus álbuns e artistas mais escutados no Last.fm. Gerador gratuito de semaninha com diferentes períodos e tamanhos.',
  },
  {
    path: '/how-to-use',
    title: 'Como usar o semaninha - Colagens do Last.fm',
    description:
      'Passo a passo para criar sua conta no Last.fm, conectar o Spotify e gerar colagens com seus álbuns e artistas mais ouvidos.',
  },
  {
    path: '/wrapped',
    title: `Wrapped ${WRAPPED_YEAR} do Last.fm - Semaninha`,
    description: `Sua retrospectiva musical de ${WRAPPED_YEAR} com os dados do Last.fm: scrobbles, artista do ano, músicas e álbuns mais ouvidos numa imagem para o story.`,
  },
  {
    path: '/what-is-a-scrobble',
    title: 'O que é um scrobble no Last.fm? - Semaninha',
    description:
      'Entenda o que é um scrobble, como o Last.fm registra o que você ouve, quando uma música conta e como seu histórico vira estatísticas e colagens.',
  },
  {
    path: '/connect-your-player',
    title: 'Como conectar o Spotify ao Last.fm - Semaninha',
    description:
      'Passo a passo para conectar o Spotify e outros players ao Last.fm e começar a registrar o que você ouve, com dicas para quando as músicas não aparecem.',
  },
  {
    path: '/about',
    title: 'Sobre o semaninha',
    description:
      'O que é o semaninha, como ele gera colagens a partir do seu histórico do Last.fm, quem faz o site e como ele se mantém.',
  },
  {
    path: '/support',
    title: 'Apoie o semaninha',
    description:
      'Ajude a manter o semaninha no ar com uma contribuição via Pix e veja outras formas de apoiar o projeto.',
  },
  {
    path: '/privacy',
    title: 'Política de Privacidade - Semaninha',
    description:
      'Como o semaninha usa os dados do Last.fm, além dos cookies do Google Analytics e do Google AdSense.',
  },
];

export const getPageMeta = (pathname: string): PageMeta =>
  PAGE_META.find((page) => page.path === pathname) ?? PAGE_META[0];

export const getCanonicalUrl = (path: string): string =>
  path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
