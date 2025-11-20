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
  
  items.forEach((item) => {
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
