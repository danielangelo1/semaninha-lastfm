import setFont from "./setFont.js";

export default function setFontSize(gridSize) {
  let fontSize;
  let placeY;

  switch (gridSize) {
    case "3":
      fontSize = 18;
      placeY = 18;
      break;
    case "4":
      fontSize = 16;
      placeY = 14;
      break;
    case "5":
      fontSize = 14;
      placeY = 12;
      break;
    case "6":
      fontSize = 12;
      placeY = 10;
      break;
    case "7":
      fontSize = 12;
      placeY = 10;
      break;
    default:
      fontSize = 18;
      placeY = 18;
      break;
  }

  return { fontSize, placeY };
}
