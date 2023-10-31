export default async function loadFontAndStyle() {
  const FONT_NAME = "Fira Sans";
  const FONT_URL = "../FiraSans-Italic.ttf";

  const style = document.createElement("style");
  const font = new FontFace(FONT_NAME, `url("${FONT_URL}")`);

  try {
    await font.load();
    document.fonts.add(font);

    style.appendChild(
      document.createTextNode(`
        @font-face {
          font-family: '${FONT_NAME}';
          src: url('${FONT_URL}') format('truetype');
        }
      `)
    );

    document.head.appendChild(style);
  } catch (error) {
    console.error("Erro ao carregar a fonte:", error);
  }
}
