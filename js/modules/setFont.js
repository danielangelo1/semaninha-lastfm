export default function setFont(context, size) {
  const FONT_NAME = "Fira Sans";

  context.font = `${size}px ${FONT_NAME}`;
  context.shadowColor = "#2b2b2b";
  context.shadowBlur = 0.3;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.fillStyle = "white";
}
