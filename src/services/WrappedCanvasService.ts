import { WrappedData } from '../types/wrapped';
import {
  WRAPPED_CANVAS_CONFIG,
  WRAPPED_COLORS,
  WRAPPED_TYPOGRAPHY,
  WRAPPED_LAYOUT,
  WRAPPED_SECTIONS,
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
  const { WIDTH, HEIGHT, BACKGROUND_GRADIENT, DECORATIVE_CIRCLES } = WRAPPED_CANVAS_CONFIG;

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, BACKGROUND_GRADIENT.START);
  gradient.addColorStop(0.5, BACKGROUND_GRADIENT.MIDDLE);
  gradient.addColorStop(1, BACKGROUND_GRADIENT.END);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Add decorative circles
  DECORATIVE_CIRCLES.forEach(circle => {
    ctx.fillStyle = circle.color;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fill();
  });
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
 * Draw circular images at the top of a section
 */
const drawSectionImages = async (
  ctx: CanvasRenderingContext2D,
  images: string[],
  startY: number
): Promise<number> => {
  const imageSize = 80;
  const spacing = 20;
  const totalWidth = images.length * imageSize + (images.length - 1) * spacing;
  const startX = (WRAPPED_CANVAS_CONFIG.WIDTH - totalWidth) / 2;
  
  try {
    const loadedImages = await Promise.allSettled(
      images.map(src => loadImage(src))
    );

    let currentX = startX;
    loadedImages.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const img = result.value;
        
        // Save context
        ctx.save();
        
        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(currentX + imageSize / 2, startY + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // Draw image
        ctx.drawImage(img, currentX, startY, imageSize, imageSize);
        
        // Restore context
        ctx.restore();
        
        // Draw border
        ctx.strokeStyle = WRAPPED_COLORS.TEXT_SECONDARY;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(currentX + imageSize / 2, startY + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      currentX += imageSize + spacing;
    });
  } catch (error) {
    console.warn('Error loading section images:', error);
  }
  
  return startY + imageSize + 40; // Return new Y position after images
};

/**
 * Draw the footer
 */
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
 * Generate the Wrapped canvas
 */
export const generateWrappedCanvas = async (data: WrappedData): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  canvas.width = WRAPPED_CANVAS_CONFIG.WIDTH;
  canvas.height = WRAPPED_CANVAS_CONFIG.HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not found');
  }

  // Draw background
  drawBackground(ctx);

  // Draw header
  let currentY = drawHeader(ctx, data.username);

  // Fetch images for artists and albums
  const artistImagePromises = data.artists.slice(0, 3).map(async (artist) => {
    try {
      const img = await getArtistImage(artist.name);
      return img.url;
    } catch {
      return '';
    }
  });

  const albumImageUrls = data.albums.slice(0, 3).map(album => album.image[2]?.['#text'] || '').filter(url => url);

  const [artistImages] = await Promise.all([
    Promise.all(artistImagePromises),
  ]);

  // Draw Artists Section
  const artistItems = data.artists.map(artist => ({
    name: artist.name,
    detail: `${artist.playcount} plays`,
  }));

  // Draw section title
  drawTextWithShadow(
    ctx,
    WRAPPED_SECTIONS[0].title,
    WRAPPED_LAYOUT.PADDING.HORIZONTAL,
    currentY,
    WRAPPED_TYPOGRAPHY.SECTION.TITLE_SIZE,
    WRAPPED_COLORS.TEXT_PRIMARY,
    WRAPPED_TYPOGRAPHY.SECTION.TITLE_WEIGHT
  );
  currentY += 60;

  // Draw artist images
  const validArtistImages = artistImages.filter(url => url);
  if (validArtistImages.length > 0) {
    currentY = await drawSectionImages(ctx, validArtistImages, currentY);
  }

  // Draw artist items
  artistItems.forEach((item, index) => {
    currentY = drawItem(
      ctx,
      index + 1,
      item.name,
      item.detail,
      WRAPPED_LAYOUT.PADDING.HORIZONTAL,
      currentY,
      WRAPPED_SECTIONS[0].color
    );
  });
  currentY += WRAPPED_LAYOUT.SPACING.BETWEEN_SECTIONS;

  // Draw Tracks Section
  const trackItems = data.tracks.map(track => ({
    name: track.name,
    detail: track.artist.name,
  }));

  currentY = drawSection(ctx, WRAPPED_SECTIONS[1].title, trackItems, currentY, WRAPPED_SECTIONS[1].color);

  // Draw Albums Section
  const albumItems = data.albums.map(album => ({
    name: album.name,
    detail: album.artist.name,
  }));

  currentY = drawSection(ctx, WRAPPED_SECTIONS[2].title, albumItems, currentY, WRAPPED_SECTIONS[2].color);

  // Draw footer
  drawFooter(ctx);

  return canvas;
};
