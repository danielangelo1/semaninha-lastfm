import { WrappedData } from '../types/wrapped';
import {
  WRAPPED_CANVAS_CONFIG,
  WRAPPED_COLORS,
  WRAPPED_TYPOGRAPHY,
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

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#2d1b1b');
  gradient.addColorStop(0.3, '#3d2626');
  gradient.addColorStop(0.6, '#4a2c2c');
  gradient.addColorStop(1, '#2d1b1b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Add decorative circles with gradient
  const circle1 = ctx.createRadialGradient(200, 300, 0, 200, 300, 400);
  circle1.addColorStop(0, 'rgba(195, 0, 13, 0.15)');
  circle1.addColorStop(1, 'rgba(195, 0, 13, 0)');
  ctx.fillStyle = circle1;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const circle2 = ctx.createRadialGradient(WIDTH - 200, HEIGHT - 400, 0, WIDTH - 200, HEIGHT - 400, 500);
  circle2.addColorStop(0, 'rgba(255, 107, 107, 0.12)');
  circle2.addColorStop(1, 'rgba(255, 107, 107, 0)');
  ctx.fillStyle = circle2;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Add subtle texture/noise effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT;
    const size = Math.random() * 2;
    ctx.fillRect(x, y, size, size);
  }
};

/**
 * Draw artist images with #1 in center (large) and others behind (smaller)
 */
const drawHighlightedArtistImages = async (
  ctx: CanvasRenderingContext2D,
  images: string[],
  startY: number
): Promise<number> => {
  const centerImageWidth = 400;
  const centerImageHeight = 400;
  const sideImageWidth = 320;
  const sideImageHeight = 320;
  const borderRadius = 20;
  const centerX = WRAPPED_CANVAS_CONFIG.WIDTH / 2;
  
  try {
    const loadedImages = await Promise.allSettled(
      images.map(src => loadImage(src))
    );

    const validImages = loadedImages
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<HTMLImageElement>).value);

    if (validImages.length === 0) return startY;

    const drawRoundedImage = (img: HTMLImageElement, x: number, y: number, width: number, height: number, opacity: number = 1) => {
      ctx.save();
      
      ctx.globalAlpha = opacity;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 15;
      
      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + width - borderRadius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
      ctx.lineTo(x + width, y + height - borderRadius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
      ctx.lineTo(x + borderRadius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();
      ctx.clip();
      
      ctx.drawImage(img, x, y, width, height);
      
      ctx.restore();
      
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + width - borderRadius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
      ctx.lineTo(x + width, y + height - borderRadius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
      ctx.lineTo(x + borderRadius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    // Draw side images first (behind)
    if (validImages.length > 1) {
      // Left image (#2)
      const leftX = centerX - centerImageWidth / 2 - sideImageWidth + 40;
      const leftY = startY + 40;
      drawRoundedImage(validImages[1], leftX, leftY, sideImageWidth, sideImageHeight, 0.7);
    }

    if (validImages.length > 2) {
      // Right image (#3)
      const rightX = centerX + centerImageWidth / 2 - 40;
      const rightY = startY + 40;
      drawRoundedImage(validImages[2], rightX, rightY, sideImageWidth, sideImageHeight, 0.7);
    }

    // Draw center image (#1) on top
    const centerImgX = centerX - centerImageWidth / 2;
    const centerImgY = startY;
    drawRoundedImage(validImages[0], centerImgX, centerImgY, centerImageWidth, centerImageHeight, 1);
    
    return startY + centerImageHeight + 40;
  } catch (error) {
    console.warn('Error loading artist images:', error);
    return startY;
  }
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
  ctx.font = `700 34px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = color;
  ctx.fillText(title, x, y);
  
  let currentY = y + 50;  
  
  items.forEach((item) => {
    ctx.font = `600 32px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
    ctx.fillStyle = WRAPPED_COLORS.TEXT_PRIMARY;
    const truncated = truncateText(ctx, item.name, 420);
    ctx.fillText(truncated, x, currentY);
    
    if (item.detail) {
      ctx.font = `400 24px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
      ctx.fillStyle = WRAPPED_COLORS.TEXT_SECONDARY;
      const truncatedDetail = truncateText(ctx, item.detail, 420);
      ctx.fillText(truncatedDetail, x, currentY + 28);
      currentY += 60;
    } else {
      currentY += 45;
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

  let currentY = 90;

  if (validArtistImages.length > 0) {
    currentY = await drawHighlightedArtistImages(ctx, validArtistImages, currentY);
  }

  currentY += 20;

  ctx.font = `700 72px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = WRAPPED_COLORS.TEXT_PRIMARY;
  ctx.textAlign = 'center';
  ctx.fillText(data.username, WRAPPED_CANVAS_CONFIG.WIDTH / 2, currentY);
  currentY += 60;
  
  ctx.font = `600 32px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = '#e07b7b';
  ctx.fillText('SCROBBLES', WRAPPED_CANVAS_CONFIG.WIDTH / 2, currentY);
  currentY += 20;
  
  ctx.font = `900 84px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = WRAPPED_COLORS.TEXT_PRIMARY;
  ctx.fillText(data.totalScrobbles.toLocaleString(), WRAPPED_CANVAS_CONFIG.WIDTH / 2, currentY + 60);
  currentY += 200;

  ctx.textAlign = 'left';

  const leftX = 80;
  const rightX = 560;
  const listsY = currentY;

  const artistItems = data.artists.map(artist => ({
    name: artist.name,
    detail: undefined,
  }));
  
  drawCompactList(ctx, 'ARTISTAS MAIS OUVIDOS', artistItems, leftX, listsY, '#e07b7b');
  
  const trackItems = data.tracks.map(track => ({
    name: track.name,
    detail: undefined,
  }));
  
  drawCompactList(ctx, 'MÚSICAS MAIS OUVIDAS', trackItems, leftX, listsY + 320, '#e07b7b');

  const albumItems = data.albums.map(album => ({
    name: album.name,
    detail: undefined,
  }));
  
  drawCompactList(ctx, 'ÁLBUNS MAIS OUVIDOS', albumItems, rightX, listsY, '#e07b7b');

  const tagItems = data.tags.map(tag => ({
    name: tag.name,
    detail: undefined,
  }));
  
  drawCompactList(ctx, 'TAGS MAIS OUVIDAS', tagItems, rightX, listsY + 320, '#e07b7b');

  ctx.textAlign = 'center';
  ctx.font = `900 72px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = WRAPPED_COLORS.TEXT_PRIMARY;
  ctx.fillText('2025', WRAPPED_CANVAS_CONFIG.WIDTH / 2, WRAPPED_CANVAS_CONFIG.HEIGHT - 80);

  ctx.font = `600 28px ${WRAPPED_TYPOGRAPHY.FONT_FAMILY}`;
  ctx.fillStyle = WRAPPED_COLORS.TEXT_SECONDARY;
  ctx.fillText('semaninha.net', WRAPPED_CANVAS_CONFIG.WIDTH / 2, WRAPPED_CANVAS_CONFIG.HEIGHT - 40);

  return canvas;
};
