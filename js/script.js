function generateGrid() {
  // Obter os valores dos campos de entrada do usuário
  const userInput = document.getElementById("userInput").value;
  const timeRange = document.getElementById("timeRange").value;
  const gridSize = document.getElementById("gridSize").value;
  const gridType = document.getElementById("gridType").value;
  const showAlbumName = document.getElementById("showAlbumName").checked;
  const showAlbumPlaycount =
    document.getElementById("showAlbumPlaycount").checked;

  const albumGrid = document.getElementById("albumGrid");

  let apiMethod = "";
  if (gridType === "albums") {
    apiMethod = "user.getTopAlbums";
  } else if (gridType === "artists") {
    apiMethod = "user.getTopArtists";
  }

  fetch(
    `https://ws.audioscrobbler.com/2.0/?method=${apiMethod}&user=${userInput}&period=${timeRange}&api_key=e713e4ee81e3cfee0417956233a9faa1&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      albumGrid.innerHTML = "";

      const totalCells = gridSize * gridSize;

      if (gridType === "albums") {
        data.topalbums.album.slice(0, totalCells).forEach((album) => {
          const albumContainer = document.createElement("div");
          albumContainer.className = "album";

          const img = document.createElement("img");
          img.src = album.image[3]["#text"];
          img.alt = album.name;
          img.className = "album-image";
          albumContainer.appendChild(img);

          if (showAlbumName) {
            const albumName = document.createElement("div");
            albumName.className = "album-name";
            albumName.textContent = album.name;
            albumContainer.appendChild(albumName);
          }

          if (showAlbumPlaycount) {
            const albumPlaycount = document.createElement("div");
            albumPlaycount.className = "album-playcount";
            albumPlaycount.textContent = `Plays: ${album.playcount}`;
            albumContainer.appendChild(albumPlaycount);
          }

          albumGrid.appendChild(albumContainer);
        });
      } else if (gridType === "artists") {
        data.topartists.artist.slice(0, totalCells).forEach((artist) => {
          const img = document.createElement("img");
          img.src = artist.image[3]["#text"];
          img.alt = artist.name;
          img.className = "album-image";
          albumGrid.appendChild(img);
        });
      }

      // Definir o tamanho do grid
      albumGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      albumGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

      const downloadButton = document.getElementById("downloadButton");
      downloadButton.style.display = "block";
    })
    .catch((error) => {
      alert("Usuário não encontrado!");
      console.error("Erro na requisição à API do Last.fm:", error);
    });
}

function downloadGrid() {
  const albumGrid = document.getElementById("albumGrid");

  // Usar a biblioteca dom-to-image para capturar o conteúdo do grid como uma imagem
  domtoimage
    .toPng(albumGrid)
    .then(function (dataUrl) {
      // Criar um link de download para a imagem gerada
      const link = document.createElement("a");

      // Criar um elemento de imagem para redimensionar a imagem
      const img = new Image();
      img.src = dataUrl;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 1250;
        canvas.height = 1250;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1250, 1250);
        link.href = canvas.toDataURL("image/png");
        link.download = "albumGrid.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    })
    .catch(function (error) {
      console.error("Erro ao gerar a imagem do grid:", error);
    });
}
