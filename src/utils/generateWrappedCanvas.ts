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

/** Rows of "01  Name"; y is the first row's baseline */
const drawRankedRows = (
  ctx: Ctx,
  names: string[],
  x: number,
  y: number,
  width: number,
  { firstRank = 1, step = 72 } = {},
): void => {
  const rankWidth = 56;
  names.forEach((name, index) => {
    const rowY = y + index * step;

    setFont(ctx, 500, 26);
    drawText(ctx, String(firstRank + index).padStart(2, '0'), x, rowY, WRAPPED_COLORS.TEXT_TERTIARY);

    setFont(ctx, 600, 32, -0.5);
    drawText(ctx, truncateText(ctx, name, width - rankWidth), x + rankWidth, rowY, WRAPPED_COLORS.TEXT_PRIMARY);
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
  drawRule(ctx, 600);
  drawEyebrow(ctx, labels.scrobbles, PAD, 664, WRAPPED_COLORS.TEXT_SECONDARY);
  setFont(ctx, 700, 112, -4);
  drawText(ctx, formatNumber(data.totalScrobbles), PAD - 4, 778, WRAPPED_COLORS.TEXT_PRIMARY);
  setFont(ctx, 400, 30);
  drawText(
    ctx,
    `${formatCount(data.stats.totalArtists)} ${labels.artists.toLocaleLowerCase(locale)} · ` +
      `${formatCount(data.stats.totalAlbums)} ${labels.albums.toLocaleLowerCase(locale)}`,
    PAD,
    830,
    WRAPPED_COLORS.TEXT_SECONDARY,
  );

  // Right-aligned so a six-digit scrobble count still has room on the left
  setFont(ctx, 500, 24, 4);
  drawText(ctx, labels.dailyAverage.toUpperCase(), WIDTH - PAD, 664, WRAPPED_COLORS.TEXT_SECONDARY, 'right');
  setFont(ctx, 700, 112, -4);
  drawText(
    ctx,
    data.stats.dailyAverage.toLocaleString(locale, {
      maximumFractionDigits: data.stats.dailyAverage < 10 ? 1 : 0,
    }),
    WIDTH - PAD,
    778,
    WRAPPED_COLORS.TEXT_PRIMARY,
    'right',
  );

  const columnGap = 48;
  const columnWidth = (CONTENT_WIDTH - columnGap) / 2;

  // Artist of the year, then the runners-up in two columns
  drawRule(ctx, 880);
  const [topArtist, ...otherArtists] = data.artists;
  if (topArtist) {
    const photoSize = 180;
    const textWidth = artistImage ? CONTENT_WIDTH - photoSize - 48 : CONTENT_WIDTH;

    drawEyebrow(ctx, labels.topArtist, PAD, 952, WRAPPED_COLORS.ACCENT);
    setFont(ctx, 700, 92, -3.5);
    drawText(ctx, truncateText(ctx, topArtist.name, textWidth), PAD - 5, 1050, WRAPPED_COLORS.TEXT_PRIMARY);
    setFont(ctx, 400, 30);
    drawText(
      ctx,
      `${formatNumber(Number(topArtist.playcount))} ${labels.plays}`,
      PAD,
      1096,
      WRAPPED_COLORS.TEXT_SECONDARY,
    );

    if (artistImage) {
      // Beside the name and plays, clear of the runners-up below
      drawCircularImage(ctx, artistImage, WIDTH - PAD - photoSize - 8, 932, photoSize);
    }

    const runnersUp = otherArtists.map((artist) => artist.name);
    drawRankedRows(ctx, runnersUp.slice(0, 2), PAD, 1178, columnWidth, { firstRank: 2, step: 58 });
    drawRankedRows(ctx, runnersUp.slice(2, 4), PAD + columnWidth + columnGap, 1178, columnWidth, {
      firstRank: 4,
      step: 58,
    });
  }

  // Tracks and albums side by side
  drawRule(ctx, 1310);
  drawEyebrow(ctx, labels.topTracks, PAD, 1382, WRAPPED_COLORS.ACCENT);
  drawRankedRows(ctx, data.tracks.map((track) => track.name), PAD, 1452, columnWidth);
  drawEyebrow(ctx, labels.topAlbums, PAD + columnWidth + columnGap, 1382, WRAPPED_COLORS.ACCENT);
  drawRankedRows(ctx, data.albums.map((album) => album.name), PAD + columnWidth + columnGap, 1452, columnWidth);

  // Footer
  drawRule(ctx, 1842);
  setFont(ctx, 500, 24, 4);
  drawText(ctx, 'SEMANINHA.NET', PAD, 1884, WRAPPED_COLORS.TEXT_TERTIARY);
  drawText(ctx, `#${WRAPPED_YEAR}`, WIDTH - PAD, 1884, WRAPPED_COLORS.TEXT_TERTIARY, 'right');

  return canvas;
};
