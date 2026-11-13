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
