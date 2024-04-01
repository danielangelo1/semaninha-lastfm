import getApiKey from "./apikey.js";
import loadFontAndStyle from "./loadFont.js";
import saveValuesLocalStorage from "./saveValuesLocalStorage.js";
import setFont from "./setFont.js";
import setFontSize from "./fontHandler.js";

export default function initGenateGrid() {
  const API_KEY = getApiKey();

  const generateGrid = () => {
    loadFontAndStyle();
    const userInput = document.getElementById("userInput").value;
    const timeRange = document.getElementById("timeRange").value;
    const gridSize = document.getElementById("gridSize").value;
    const showAlbumName = document.getElementById("showAlbumName").checked;
    const showAlbumPlaycount =
      document.getElementById("showAlbumPlaycount").checked;
    const gridType = "albums"; // Pode ser alterado para "artists" se necessário
    const albumGrid = document.getElementById("albumGrid");

    saveValuesLocalStorage(
      userInput,
      timeRange,
      gridSize,
      showAlbumName,
      showAlbumPlaycount,
    );

    let apiMethod = "";
    if (gridType === "albums") {
      apiMethod = "user.getTopAlbums";
    } else if (gridType === "artists") {
      apiMethod = "user.getTopArtists";
    }

    const { fontSize, placeY } = setFontSize(gridSize);

    const ajustableY = gridSize >= 6 ? placeY - 4 : placeY;
    const ajustableY2 = gridSize >= 6 ? placeY - 8 : placeY;

    let url = `https://ws.audioscrobbler.com/2.0/?method=${apiMethod}&user=${userInput}&period=${timeRange}&api_key=${API_KEY}&limit=${
      gridSize * gridSize
    }&format=json`;

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
          const progress = document.querySelector(".loading-spinner");

          if (loadedCount === totalCells) {
            progress.style.display = "none";
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
          } else {
            progress.style.display = "block";
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
              const y =
                Math.floor(index / gridSize) * (canvas.height / gridSize);
              context.drawImage(
                img,
                x,
                y,
                canvas.width / gridSize,
                canvas.height / gridSize,
              );
              if (showAlbumName) {
                setFont(context, fontSize);
                context.fillText(album.artist.name, x + 2, y + placeY);
                context.fillText(album.name, x + 2, y + (ajustableY + 16));
              }
              if (showAlbumPlaycount) {
                setFont(context, fontSize);
                context.fillText(
                  `Plays: ${album.playcount}`,
                  x + 2,
                  y + (ajustableY2 + 32),
                );
              }
              handleLoad();
            };
            img.onerror = function () {
              const x = (index % gridSize) * (canvas.width / gridSize);
              const y =
                Math.floor(index / gridSize) * (canvas.height / gridSize);
              context.fillStyle = "black";
              context.fillRect(
                x,
                y,
                canvas.width / gridSize,
                canvas.height / gridSize,
              );
              if (showAlbumName) {
                setFont(context, fontSize);
                context.fillText(album.artist.name, x + 2, y + placeY);
                context.fillText(album.name, x + 2, y + (ajustableY + 16));
              }
              if (showAlbumPlaycount) {
                setFont(context, fontSize);
                context.fillText(
                  `Plays: ${album.playcount}`,
                  x + 2,
                  y + (ajustableY2 + 32),
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
              const y =
                Math.floor(index / gridSize) * (canvas.height / gridSize);
              context.drawImage(
                img,
                x,
                y,
                canvas.width / gridSize,
                canvas.height / gridSize,
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
              const y =
                Math.floor(index / gridSize) * (canvas.height / gridSize);
              context.fillStyle = "black";
              context.fillRect(
                x,
                y,
                canvas.width / gridSize,
                canvas.height / gridSize,
              );
              handleLoad();
            };
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao obter os dados do Last.fm:", error);
        alert(
          "Erro ao obter os dados do Last.fm. Verifique o nome de usuário e tente novamente.",
        );
      });
  };

  const btnGenerate = document.querySelector(".generateButton");
  btnGenerate.addEventListener("click", generateGrid);
}
