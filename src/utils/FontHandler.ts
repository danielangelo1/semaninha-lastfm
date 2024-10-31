export default function fontHandler(gridSize: number) {
  const fontSizes: { [key: number]: number[] } = {
    3: [18, 18, 20],
    4: [16, 14, 14],
    5: [14, 12, 12],
    6: [12, 10, 8],
    7: [12, 8, 8],
    8: [10, 6, 4],
    9: [10, 4, 2],
    10: [10, 4, 0],
  };

  return fontSizes[gridSize];
}

export async function setFont(
  context: CanvasRenderingContext2D,
  gridSize: number,
) {
  const [artistSize, albumSize, especialPlays] = fontHandler(gridSize);
  await document.fonts.load(`${artistSize}px Fira Sans`);

  context.font = `${artistSize}px Fira Sans`;
  context.shadowColor = "#2b2b2b";
  context.shadowBlur = 0.3;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.fillStyle = "white";

  return { artistSize, albumSize, especialPlays };
}
