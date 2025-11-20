import { WrappedData } from '../types/wrapped';
import {
  WRAPPED_CANVAS_CONFIG,
  WRAPPED_COLORS,
  WRAPPED_TYPOGRAPHY,
  WRAPPED_LAYOUT,
} from '../constants/wrapped';
import { getArtistImage } from './SpotifyService';

/**
 * Load an image from a URL
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (error) => {
      console.warn('Failed to load image:', src, error);
      reject(error);
    };
    img.src = src;
  });
};

/**
 * Draw text with shadow effect
 */
const drawTextWithShadow = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
  fontWeight: string = '600',
  maxWidth?: number
): void => {
  ctx.font = `${fontWeight} ${fontSize}px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  
  // Shadow
  ctx.fillStyle = WRAPPED_COLORS.TEXT_SHADOW;
  ctx.fillText(text, x + 2, y + 2, maxWidth);
  
  // Main text
  ctx.fillStyle = color;
  ctx.fillText(text, x, y, maxWidth);
};

/**
 * Truncate text to fit within max width
 */
const truncateText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string => {
  const ellipsis = '...';
  let truncated = text;

  while (ctx.measureText(truncated).width > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }

  if (truncated.length < text.length) {
    truncated = truncated.slice(0, -3) + ellipsis;
  }

  return truncated;
};

/**
 * Draw the background with gradient and decorative elements
 */
const drawBackground = (ctx: CanvasRenderingContext2D): void => {
  const { WIDTH, HEIGHT } = WRAPPED_CANVAS_CONFIG;

  // Create solid dark background
  ctx.fillStyle = '#3d2626';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Add subtle texture/noise effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT;
    ctx.fillRect(x, y, 1, 1);
  }
};

/**
 * Draw the header section
 */
const drawHeader = (ctx: CanvasRenderingContext2D, username: string): number => {
  const { HORIZONTAL, VERTICAL } = WRAPPED_LAYOUT.PADDING;
  const { HEADER } = WRAPPED_LAYOUT.SPACING;
  let currentY = VERTICAL;

  // Title
  drawTextWithShadow(
    ctx,
    'SEU WRAPPED',
    HORIZONTAL,
    currentY,
    WRAPPED_TYPOGRAPHY.HEADER.TITLE_SIZE,
    WRAPPED_COLORS.TEXT_PRIMARY,
    WRAPPED_TYPOGRAPHY.HEADER.TITLE_WEIGHT
  );

  currentY += HEADER;

  // Year
  drawTextWithShadow(
    ctx,
    '2025',
    HORIZONTAL,
    currentY,
    WRAPPED_TYPOGRAPHY.HEADER.YEAR_SIZE,
    WRAPPED_COLORS.PRIMARY,
    WRAPPED_TYPOGRAPHY.HEADER.YEAR_WEIGHT
  );

  currentY += HEADER + 20;

  // Username
  drawTextWithShadow(
    ctx,
    `@${username}`,
    HORIZONTAL,
    currentY,
    WRAPPED_TYPOGRAPHY.HEADER.USERNAME_SIZE,
    WRAPPED_COLORS.TEXT_SECONDARY,
    WRAPPED_TYPOGRAPHY.HEADER.USERNAME_WEIGHT
  );

  return currentY + WRAPPED_LAYOUT.SPACING.SECTION;
};

/**
 * Draw a rank circle with centered text
 */
const drawRankCircle = (
  ctx: CanvasRenderingContext2D,
  rank: number,
  x: number,
  y: number,
  color: string
): void => {
  const { RADIUS, OFFSET_Y } = WRAPPED_LAYOUT.RANK_CIRCLE;
  const centerY = y + OFFSET_Y;

  // Draw circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, centerY, RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Draw rank number centered
  const rankText = `#${rank}`;
  ctx.font = `${WRAPPED_TYPOGRAPHY.ITEM.RANK_WEIGHT} ${WRAPPED_TYPOGRAPHY.ITEM.RANK_SIZE}px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  const textMetrics = ctx.measureText(rankText);
  const textX = x - textMetrics.width / 2;
  const textY = centerY + WRAPPED_TYPOGRAPHY.ITEM.RANK_SIZE / 3; // Adjust for vertical centering
  
  // Shadow
  ctx.fillStyle = WRAPPED_COLORS.TEXT_SHADOW;
  ctx.fillText(rankText, textX + 1, textY + 1);
  
  // Main text
  ctx.fillStyle = WRAPPED_COLORS.TEXT_PRIMARY;
  ctx.fillText(rankText, textX, textY);
};

/**
 * Draw a single item (artist, track, or album)
 */
const drawItem = (
  ctx: CanvasRenderingContext2D,
  rank: number,
  name: string,
  detail: string,
  x: number,
  y: number,
  color: string
): number => {
  const { RANK_CIRCLE, TEXT_OFFSET, MAX_TEXT_WIDTH } = WRAPPED_LAYOUT;

  // Draw rank circle
  drawRankCircle(ctx, rank, x + RANK_CIRCLE.OFFSET_X, y, color);

  // Draw item name
  const textX = x + TEXT_OFFSET.FROM_RANK;
  const truncatedName = truncateText(ctx, name, MAX_TEXT_WIDTH);
  drawTextWithShadow(
    ctx,
    truncatedName,
    textX,
    y,
    WRAPPED_TYPOGRAPHY.ITEM.NAME_SIZE,
    WRAPPED_COLORS.TEXT_PRIMARY,
    WRAPPED_TYPOGRAPHY.ITEM.NAME_WEIGHT,
    MAX_TEXT_WIDTH
  );

  // Draw detail (artist name or play count)
  const truncatedDetail = truncateText(ctx, detail, MAX_TEXT_WIDTH);
  drawTextWithShadow(
    ctx,
    truncatedDetail,
    textX,
    y + TEXT_OFFSET.DETAIL_Y,
    WRAPPED_TYPOGRAPHY.ITEM.DETAIL_SIZE,
    WRAPPED_COLORS.TEXT_TERTIARY,
    WRAPPED_TYPOGRAPHY.ITEM.DETAIL_WEIGHT,
    MAX_TEXT_WIDTH
  );

  return y + WRAPPED_LAYOUT.SPACING.ITEM;
};

/**
 * Draw a section (artists, tracks, or albums)
 */
const drawSection = (
  ctx: CanvasRenderingContext2D,
  title: string,
  items: Array<{ name: string; detail: string }>,
  startY: number,
  color: string
): number => {
  const { HORIZONTAL } = WRAPPED_LAYOUT.PADDING;
  const { SECTION, BETWEEN_SECTIONS } = WRAPPED_LAYOUT.SPACING;
  let currentY = startY;

  // Section title
  drawTextWithShadow(
    ctx,
    title,
    HORIZONTAL,
    currentY,
    WRAPPED_TYPOGRAPHY.SECTION.TITLE_SIZE,
    WRAPPED_COLORS.TEXT_PRIMARY,
    WRAPPED_TYPOGRAPHY.SECTION.TITLE_WEIGHT
  );

  currentY += SECTION;

  // Draw items
  items.forEach((item, index) => {
    currentY = drawItem(
      ctx,
      index + 1,
      item.name,
      item.detail,
      HORIZONTAL,
      currentY,
      color
    );
  });

  return currentY + BETWEEN_SECTIONS;
};

/**
 * Draw stacked/overlapping images at the top (like cards)
 */
const drawStackedImages = async (
  ctx: CanvasRenderingContext2D,
  images: string[],
  startY: number
): Promise<number> => {
  const imageWidth = 280;
  const imageHeight = 200;
  const borderRadius = 20;
  const overlap = 60;
  const centerX = WRAPPED_CANVAS_CONFIG.WIDTH / 2;
  
  try {
    const loadedImages = await Promise.allSettled(
      images.map(src => loadImage(src))
    );

    const validImages = loadedImages
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<HTMLImageElement>).value);

    if (validImages.length === 0) return startY;

    const totalWidth = imageWidth + (validImages.length - 1) * overlap;
    let currentX = centerX - totalWidth / 2;

    validImages.forEach((img, index) => {
      ctx.save();
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      
      const x = currentX;
      const y = startY + index * 10;
      
      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + imageWidth - borderRadius, y);
      ctx.quadraticCurveTo(x + imageWidth, y, x + imageWidth, y + borderRadius);
      ctx.lineTo(x + imageWidth, y + imageHeight - borderRadius);
      ctx.quadraticCurveTo(x + imageWidth, y + imageHeight, x + imageWidth - borderRadius, y + imageHeight);
      ctx.lineTo(x + borderRadius, y + imageHeight);
      ctx.quadraticCurveTo(x, y + imageHeight, x, y + imageHeight - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();
      ctx.clip();
      
      ctx.drawImage(img, x, y, imageWidth, imageHeight);
      
      ctx.restore();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + imageWidth - borderRadius, y);
      ctx.quadraticCurveTo(x + imageWidth, y, x + imageWidth, y + borderRadius);
      ctx.lineTo(x + imageWidth, y + imageHeight - borderRadius);
      ctx.quadraticCurveTo(x + imageWidth, y + imageHeight, x + imageWidth - borderRadius, y + imageHeight);
      ctx.lineTo(x + borderRadius, y + imageHeight);
      ctx.quadraticCurveTo(x, y + imageHeight, x, y + imageHeight - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();
      ctx.stroke();
      
      currentX += overlap;
    });
    
    return startY + imageHeight + 60;
  } catch (error) {
    console.warn('Error loading stacked images:', error);
    return startY;
  }
};

const drawFooter = (ctx: CanvasRenderingContext2D): void => {
  const { WIDTH, HEIGHT } = WRAPPED_CANVAS_CONFIG;
  const footerY = HEIGHT - 100;

  drawTextWithShadow(
    ctx,
    'semaninha.net',
    WIDTH / 2 - 250,
    footerY,
    WRAPPED_TYPOGRAPHY.FOOTER.SIZE,
    WRAPPED_COLORS.FOOTER,
    WRAPPED_TYPOGRAPHY.FOOTER.WEIGHT
  );
};

/**
 * Draw a compact list in a column
 */
const drawCompactList = (
  ctx: CanvasRenderingContext2D,
  title: string,
  items: Array<{ name: string; detail?: string }>,
  x: number,
  y: number,
  color: string
): void => {
  ctx.font = `700 24px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = color;
  ctx.fillText(title, x, y);
  
  let currentY = y + 40;  
  
  items.forEach((item, index) => {
    ctx.font = `600 20px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
    ctx.fillStyle = WRAPPED_COLORS.TEXT_PRIMARY;
    const truncated = truncateText(ctx, item.name, 400);
    ctx.fillText(truncated, x, currentY);
    
    // Detail (if exists)
    if (item.detail) {
      ctx.font = `400 16px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
      ctx.fillStyle = WRAPPED_COLORS.TEXT_SECONDARY;
      const truncatedDetail = truncateText(ctx, item.detail, 400);
      ctx.fillText(truncatedDetail, x, currentY + 22);
      currentY += 50;
    } else {
      currentY += 35;
    }
  });
};

/**
 * Generate the Wrapped canvas with compact layout
 */
export const generateWrappedCanvas = async (data: WrappedData): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  canvas.width = WRAPPED_CANVAS_CONFIG.WIDTH;
  canvas.height = WRAPPED_CANVAS_CONFIG.HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not found');
  }

  drawBackground(ctx);

  const artistImagePromises = data.artists.slice(0, 3).map(async (artist) => {
    try {
      const img = await getArtistImage(artist.name);
      return img.url;
    } catch {
      return '';
    }
  });

  const artistImages = await Promise.all(artistImagePromises);
  const validArtistImages = artistImages.filter(url => url);

  let currentY = 80;

  if (validArtistImages.length > 0) {
    currentY = await drawStackedImages(ctx, validArtistImages, currentY);
  }

  ctx.font = `700 48px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = WRAPPED_COLORS.TEXT_PRIMARY;
  ctx.textAlign = 'center';
  ctx.fillText(data.username, WRAPPED_CANVAS_CONFIG.WIDTH / 2, currentY);
  currentY += 80;

  const totalScrobbles = data.artists.reduce((sum, artist) => sum + parseInt(artist.playcount), 0);
  
  ctx.font = `400 20px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = '#e07b7b';
  ctx.fillText('SCROBBLES', WRAPPED_CANVAS_CONFIG.WIDTH / 2, currentY);
  currentY += 10;
  
  ctx.font = `900 72px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = WRAPPED_COLORS.TEXT_PRIMARY;
  ctx.fillText(totalScrobbles.toLocaleString(), WRAPPED_CANVAS_CONFIG.WIDTH / 2, currentY + 60);
  currentY += 120;

  ctx.textAlign = 'left';

  const leftX = 80;
  const rightX = 560;
  const listsY = currentY;

  // Left column: Artists and Tracks
  const artistItems = data.artists.map(artist => ({
    name: artist.name,
    detail: undefined,
  }));
  
  drawCompactList(ctx, 'ARTISTAS MAIS OUVIDOS', artistItems, leftX, listsY, '#e07b7b');
  
  const trackItems = data.tracks.map(track => ({
    name: track.name,
    detail: undefined,
  }));
  
  drawCompactList(ctx, 'MÚSICAS MAIS OUVIDAS', trackItems, leftX, listsY + 350, '#e07b7b');

  // Right column: Albums
  const albumItems = data.albums.map(album => ({
    name: album.name,
    detail: undefined,
  }));
  
  drawCompactList(ctx, 'ÁLBUNS MAIS OUVIDOS', albumItems, rightX, listsY, '#e07b7b');

  ctx.textAlign = 'center';
  ctx.font = `900 64px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = WRAPPED_COLORS.TEXT_PRIMARY;
  ctx.fillText('2025', WRAPPED_CANVAS_CONFIG.WIDTH / 2, WRAPPED_CANVAS_CONFIG.HEIGHT - 80);

  ctx.font = `600 20px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = WRAPPED_COLORS.TEXT_SECONDARY;
  ctx.fillText('semaninha.net', WRAPPED_CANVAS_CONFIG.WIDTH / 2, WRAPPED_CANVAS_CONFIG.HEIGHT - 40);

  return canvas;
};
