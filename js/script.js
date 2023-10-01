const API_KEY = "e713e4ee81e3cfee0417956233a9faa1";

const FONT_NAME = "Fira Sans";
const FONT_URL = "./FiraSans-Italic.ttf";

function setFont(context, size) {
  context.font = `${size}px ${FONT_NAME}`;
  context.shadowColor = "#2b2b2b";
  context.shadowBlur = 0.3;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.fillStyle = "white";
}

async function loadFontAndStyle() {
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
loadFontAndStyle();

function generateGrid() {
  const userInput = document.getElementById("userInput").value;
  const timeRange = document.getElementById("timeRange").value;
  const gridSize = document.getElementById("gridSize").value;
  const showAlbumName = document.getElementById("showAlbumName").checked;
  const showAlbumPlaycount =
    document.getElementById("showAlbumPlaycount").checked;
  const gridType = "albums"; // Pode ser alterado para "artists" se necessário
  const albumGrid = document.getElementById("albumGrid");

  let apiMethod = "";
  if (gridType === "albums") {
    apiMethod = "user.getTopAlbums";
  } else if (gridType === "artists") {
    apiMethod = "user.getTopArtists";
  }

  let fontSize = 18;
  let placeY = 18;

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
  }

  let url = `https://ws.audioscrobbler.com/2.0/?method=${apiMethod}&user=${userInput}&period=${timeRange}&api_key=${API_KEY}&format=json`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const totalCells = gridSize * gridSize;

      const canvas = document.createElement("canvas");
      canvas.width = 1250;
      canvas.height = 1250;
      const context = canvas.getContext("2d");

      let loadedCount = 0;

      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === totalCells) {
          const generatedImage = document.createElement("img");
          generatedImage.src = canvas.toDataURL();
          generatedImage.alt =
            gridType === "albums"
              ? "Generated Album Grid"
              : "Generated Artist Grid";
          generatedImage.className = "generated-image";
          albumGrid.innerHTML = "";
          albumGrid.appendChild(generatedImage);

          const downloadButton = document.getElementById("downloadButton");
          downloadButton.style.display = "block";
        }
      };

      if (gridType === "albums") {
        const albums = data.topalbums.album.slice(0, totalCells);
        albums.forEach((album, index) => {
          const img = new Image();
          img.src = album.image[3]["#text"];
          img.crossOrigin = "Anonymous";
          img.onload = function () {
            const x = (index % gridSize) * (canvas.width / gridSize);
            const y = Math.floor(index / gridSize) * (canvas.height / gridSize);
            context.drawImage(
              img,
              x,
              y,
              canvas.width / gridSize,
              canvas.height / gridSize
            );
            if (showAlbumName) {
              setFont(context, fontSize);
              context.fillText(album.artist.name, x + 2, y + placeY);
              context.fillText(album.name, x + 2, y + (placeY + 16));
            }
            if (showAlbumPlaycount) {
              setFont(context, fontSize);
              context.fillText(
                `Plays: ${album.playcount}`,
                x + 2,
                y + (placeY + 32)
              );
            }
            handleLoad();
          };
          img.onerror = function () {
            const x = (index % gridSize) * (canvas.width / gridSize);
            const y = Math.floor(index / gridSize) * (canvas.height / gridSize);
            context.fillStyle = "black";
            context.fillRect(
              x,
              y,
              canvas.width / gridSize,
              canvas.height / gridSize
            );
            if (showAlbumName) {
              setFont(context, fontSize);
              context.fillText(album.artist.name, x + 2, y + placeY);
              context.fillText(album.name, x + 2, y + (placeY + 16));
            }
            if (showAlbumPlaycount) {
              setFont(context, fontSize);
              context.fillText(
                `Plays: ${album.playcount}`,
                x + 2,
                y + (placeY + 32)
              );
            }
            handleLoad();
          };
        });
      } else if (gridType === "artists") {
        const artists = data.topartists.artist.slice(0, totalCells);
        artists.forEach((artist, index) => {
          const img = new Image();
          img.src = artist.image[3]["#text"];
          img.crossOrigin = "Anonymous";
          img.onload = function () {
            const x = (index % gridSize) * (canvas.width / gridSize);
            const y = Math.floor(index / gridSize) * (canvas.height / gridSize);
            context.drawImage(
              img,
              x,
              y,
              canvas.width / gridSize,
              canvas.height / gridSize
            );
            if (showAlbumName) {
              setFont(context, fontSize);
              context.fillText(artist.name, x + 5, y + 20);
            }
            if (showAlbumPlaycount) {
              setFont(context, fontSize);
              context.fillText(`Plays: ${artist.playcount}`, x + 5, y + 40);
            }
            handleLoad();
          };
          img.onerror = function () {
            const x = (index % gridSize) * (canvas.width / gridSize);
            const y = Math.floor(index / gridSize) * (canvas.height / gridSize);
            context.fillStyle = "black";
            context.fillRect(
              x,
              y,
              canvas.width / gridSize,
              canvas.height / gridSize
            );
            handleLoad();
          };
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao obter os dados do Last.fm:", error);
      alert(
        "Erro ao obter os dados do Last.fm. Verifique o nome de usuário e tente novamente."
      );
    });
}

function downloadGrid() {
  const generatedImage = document.querySelector(".generated-image");
  if (generatedImage) {
    const link = document.createElement("a");
    link.href = generatedImage.src;
    link.download = "semaninha.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("Sem imagem para baixar!");
  }
}
