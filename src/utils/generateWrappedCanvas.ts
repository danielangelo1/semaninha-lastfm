import { WrappedCanvasLabels, WrappedData } from '../types/wrapped';
import {
  WRAPPED_API_CONFIG,
  WRAPPED_CANVAS_CONFIG,
  WRAPPED_COLORS,
  WRAPPED_TYPOGRAPHY,
  WRAPPED_YEAR,
} from '../constants/wrapped';
import { getArtistImage } from '../services/SpotifyService';
import { loadImage } from './canvasUtils';

const { WIDTH, HEIGHT } = WRAPPED_CANVAS_CONFIG;
const PAD = 96;
const CONTENT_WIDTH = WIDTH - PAD * 2;
const FONT = WRAPPED_TYPOGRAPHY.FONT_FAMILY;

type Ctx = CanvasRenderingContext2D;

/**
 * Truncate text to fit within max width
 */
const truncateText = (ctx: Ctx, text: string, maxWidth: number): string => {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(`${truncated}…`).width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated.trimEnd()}…`;
};

const setFont = (ctx: Ctx, weight: number, size: number, tracking = 0): void => {
  ctx.font = `${weight} ${size}px ${FONT}`;
  // Not supported everywhere; older browsers just draw without tracking
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = `${tracking}px`;
};

const drawText = (
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  color: string,
  align: CanvasTextAlign = 'left',
): void => {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};

const drawRule = (ctx: Ctx, y: number): void => {
  ctx.fillStyle = WRAPPED_COLORS.RULE;
  ctx.fillRect(PAD, y, CONTENT_WIDTH, 2);
};

/** Small uppercase, letter-spaced label */
const drawEyebrow = (ctx: Ctx, text: string, x: number, y: number, color: string): void => {
  setFont(ctx, 500, 24, 4);
  drawText(ctx, text.toUpperCase(), x, y, color);
};

/** The canvas only sees fonts that finished loading, so wait for the weights we use */
const ensureFonts = async (): Promise<void> => {
  try {
    await Promise.all(
      [400, 500, 600, 700].map((weight) => document.fonts.load(`${weight} 32px Poppins`)),
    );
  } catch {
    // Falls back to the next font in the stack
  }
};

const drawBackground = (ctx: Ctx): void => {
  ctx.fillStyle = WRAPPED_COLORS.BACKGROUND;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = ctx.createRadialGradient(WIDTH * 0.9, 120, 0, WIDTH * 0.9, 120, 1000);
  glow.addColorStop(0, WRAPPED_COLORS.GLOW);
  glow.addColorStop(1, 'rgba(195, 0, 13, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Fine grain so the flat dark areas don't band
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let i = 0; i < 9000; i++) {
    ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 1.5, 1.5);
  }
};

const drawCircularImage = (ctx: Ctx, img: HTMLImageElement, x: number, y: number, size: number): void => {
  const radius = size / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
  ctx.clip();
  // Cover-crop non-square photos
  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, x + (size - w) / 2, y + (size - h) / 2, w, h);
  ctx.restore();

  ctx.strokeStyle = WRAPPED_COLORS.RULE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius + 8, 0, Math.PI * 2);
  ctx.stroke();
};

const loadOptionalImage = async (getUrl: () => Promise<string | null>): Promise<HTMLImageElement | null> => {
  try {
    const url = await getUrl();
    return url ? await loadImage(url) : null;
  } catch {
    return null;
  }
};

/** Ranked list: "01  Name" with a secondary line underneath */
const drawRankedList = (
  ctx: Ctx,
  title: string,
  items: Array<{ name: string; detail: string }>,
  x: number,
  y: number,
  width: number,
): void => {
  drawEyebrow(ctx, title, x, y, WRAPPED_COLORS.ACCENT);

  const rankWidth = 56;
  items.forEach((item, index) => {
    const rowY = y + 70 + index * 74;

    setFont(ctx, 500, 26);
    drawText(ctx, String(index + 1).padStart(2, '0'), x, rowY, WRAPPED_COLORS.TEXT_TERTIARY);

    setFont(ctx, 600, 30, -0.5);
    drawText(ctx, truncateText(ctx, item.name, width - rankWidth), x + rankWidth, rowY, WRAPPED_COLORS.TEXT_PRIMARY);

    setFont(ctx, 400, 24);
    drawText(ctx, truncateText(ctx, item.detail, width - rankWidth), x + rankWidth, rowY + 32, WRAPPED_COLORS.TEXT_SECONDARY);
  });
};

/**
 * Generate the Wrapped image (1080x1920 story format)
 */
export const generateWrappedCanvas = async (
  data: WrappedData,
  labels: WrappedCanvasLabels,
  locale?: string,
): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not found');
  }

  const topArtistName = data.artists[0]?.name;
  const [, avatarImage, artistImage] = await Promise.all([
    ensureFonts(),
    loadOptionalImage(async () => data.avatarUrl),
    loadOptionalImage(async () => (topArtistName ? (await getArtistImage(topArtistName)).url : null)),
  ]);

  const formatNumber = (value: number) => value.toLocaleString(locale);
  const formatCount = (value: number) =>
    // Charts are capped by Last.fm, so a count at the cap means "at least"
    `${formatNumber(value)}${value >= WRAPPED_API_CONFIG.CHART_LIMIT ? '+' : ''}`;

  ctx.textBaseline = 'alphabetic';
  drawBackground(ctx);

  // Top bar
  drawEyebrow(ctx, 'Semaninha Wrapped', PAD, 132, WRAPPED_COLORS.TEXT_SECONDARY);
  setFont(ctx, 500, 24, 4);
  drawText(ctx, `@${data.username}`, WIDTH - PAD, 132, WRAPPED_COLORS.TEXT_SECONDARY, 'right');
  drawRule(ctx, 172);

  // Hero: the year, then who and what
  setFont(ctx, 700, 220, -10);
  drawText(ctx, String(WRAPPED_YEAR), PAD - 9, 440, WRAPPED_COLORS.ACCENT);

  setFont(ctx, 400, 40, -0.5);
  drawText(ctx, labels.subtitle, PAD, 528, WRAPPED_COLORS.TEXT_SECONDARY);

  if (avatarImage) {
    const avatarSize = 184;
    drawCircularImage(ctx, avatarImage, WIDTH - PAD - avatarSize - 8, 262, avatarSize);
  }

  // Numbers
  drawRule(ctx, 610);
  drawEyebrow(ctx, labels.scrobbles, PAD, 680, WRAPPED_COLORS.TEXT_SECONDARY);
  setFont(ctx, 700, 150, -6);
  drawText(ctx, formatNumber(data.totalScrobbles), PAD - 6, 824, WRAPPED_COLORS.TEXT_PRIMARY);

  // Right-aligned so a six-digit scrobble count still has room on the left
  setFont(ctx, 500, 24, 4);
  drawText(ctx, labels.dailyAverage.toUpperCase(), WIDTH - PAD, 680, WRAPPED_COLORS.TEXT_SECONDARY, 'right');
  setFont(ctx, 700, 120, -5);
  drawText(
    ctx,
    data.stats.dailyAverage.toLocaleString(locale, {
      maximumFractionDigits: data.stats.dailyAverage < 10 ? 1 : 0,
    }),
    WIDTH - PAD,
    824,
    WRAPPED_COLORS.TEXT_PRIMARY,
    'right',
  );

  const stats = [
    { value: data.stats.totalArtists, label: labels.artists },
    { value: data.stats.totalAlbums, label: labels.albums },
    { value: data.stats.totalTracks, label: labels.tracks },
  ];
  const statWidth = CONTENT_WIDTH / stats.length;
  stats.forEach((stat, index) => {
    const x = PAD + index * statWidth;
    setFont(ctx, 600, 64, -2);
    drawText(ctx, formatCount(stat.value), x, 936, WRAPPED_COLORS.TEXT_PRIMARY);
    setFont(ctx, 400, 28);
    drawText(ctx, stat.label, x, 978, WRAPPED_COLORS.TEXT_SECONDARY);
  });

  // Artist of the year, with the runners-up on one line
  drawRule(ctx, 1036);
  const [topArtist, ...otherArtists] = data.artists;
  if (topArtist) {
    const photoSize = 216;
    const textWidth = artistImage ? CONTENT_WIDTH - photoSize - 48 : CONTENT_WIDTH;

    drawEyebrow(ctx, labels.topArtist, PAD, 1106, WRAPPED_COLORS.ACCENT);
    setFont(ctx, 700, 76, -3);
    drawText(ctx, truncateText(ctx, topArtist.name, textWidth), PAD - 4, 1196, WRAPPED_COLORS.TEXT_PRIMARY);
    setFont(ctx, 400, 30);
    drawText(
      ctx,
      `${formatNumber(Number(topArtist.playcount))} ${labels.plays}`,
      PAD,
      1244,
      WRAPPED_COLORS.TEXT_SECONDARY,
    );
    if (otherArtists.length > 0) {
      setFont(ctx, 500, 28);
      drawText(
        ctx,
        truncateText(ctx, otherArtists.map((a) => a.name).join(' · '), textWidth),
        PAD,
        1290,
        WRAPPED_COLORS.TEXT_TERTIARY,
      );
    }

    if (artistImage) {
      drawCircularImage(ctx, artistImage, WIDTH - PAD - photoSize, 1086, photoSize);
    }
  }

  // Tracks and albums side by side
  drawRule(ctx, 1350);
  const columnGap = 48;
  const columnWidth = (CONTENT_WIDTH - columnGap) / 2;
  drawRankedList(
    ctx,
    labels.topTracks,
    data.tracks.map((track) => ({ name: track.name, detail: track.artist.name })),
    PAD,
    1418,
    columnWidth,
  );
  drawRankedList(
    ctx,
    labels.topAlbums,
    data.albums.map((album) => ({ name: album.name, detail: album.artist.name })),
    PAD + columnWidth + columnGap,
    1418,
    columnWidth,
  );

  // Footer
  drawRule(ctx, 1842);
  setFont(ctx, 500, 24, 4);
  drawText(ctx, 'SEMANINHA.NET', PAD, 1884, WRAPPED_COLORS.TEXT_TERTIARY);
  drawText(ctx, `#${WRAPPED_YEAR}`, WIDTH - PAD, 1884, WRAPPED_COLORS.TEXT_TERTIARY, 'right');

  return canvas;
};
