function generateGrid() {
  const userInput = document.getElementById("userInput").value;
  const timeRange = document.getElementById("timeRange").value;
  const gridSize = document.getElementById("gridSize").value;
  // const gridType = document.getElementById("gridType").value;
  const showAlbumName = document.getElementById("showAlbumName").checked;
  const showAlbumPlaycount =
    document.getElementById("showAlbumPlaycount").checked;

  const gridType = "albums";
  const albumGrid = document.getElementById("albumGrid");
  let fontSize = 18;

  let apiMethod = "";
  if (gridType === "albums") {
    apiMethod = "user.getTopAlbums";
  } else if (gridType === "artists") {
    apiMethod = "user.getTopArtists";
  }

  switch (gridSize) {
    case "3":
      fontSize = 18;
      break;
    case "4":
      fontSize = 16;
      break;
    case "5":
      fontSize = 14;
      break;
  }

  fetch(
    `https://ws.audioscrobbler.com/2.0/?method=${apiMethod}&user=${userInput}&period=${timeRange}&api_key=e713e4ee81e3cfee0417956233a9faa1&format=json`
  )
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
              context.font = `${fontSize}px Arial`;
              context.shadowColor = "#2b2b2b";
              context.shadowBlur = 5;
              context.shadowOffsetX = 2;
              context.shadowOffsetY = 2;
              context.fillStyle = "white";
              context.fillText(album.artist.name, x + 2, y + 20);

              const albumText = `${album.artist.name} - ${album.name}`;
              const albumTextWidth = context.measureText(albumText).width;

              if (albumTextWidth > img.width) {
                const scaleFactor = img.width / albumTextWidth;
                const scaledFontSize = fontSize * scaleFactor;
                context.font = `${scaledFontSize}px Arial`;
              }

              context.fillText(album.name, x + 2, y + 40);
            }
            if (showAlbumPlaycount) {
              context.font = `${fontSize}px Arial`;
              context.shadowColor = "#2b2b2b";
              context.shadowBlur = 5;
              context.shadowOffsetX = 2;
              context.shadowOffsetY = 2;
              context.fillStyle = "white";
              context.fillText(`Plays: ${album.playcount}`, x + 2, y + 60);
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
              context.font = `${fontSize}px Arial`;
              context.shadowColor = "#2b2b2b";
              context.shadowBlur = 5;
              context.shadowOffsetX = 2;
              context.shadowOffsetY = 2;
              context.fillStyle = "white";
              context.fillText(album.artist.name, x + 2, y + 20);
              context.fillText(album.name, x + 2, y + 40);
            }
            if (showAlbumPlaycount) {
              context.font = `${fontSize}px Arial`;
              context.shadowColor = "#2b2b2b";
              context.shadowBlur = 5;
              context.shadowOffsetX = 2;
              context.shadowOffsetY = 2;
              context.fillStyle = "white";
              context.fillText(`Plays: ${album.playcount}`, x + 2, y + 60);
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
              context.font = "18px Arial";
              context.shadowColor = "#2b2b2b";
              context.shadowBlur = 5;
              context.shadowOffsetX = 2;
              context.shadowOffsetY = 2;
              context.fillStyle = "white";
              context.fillText(artist.name, x + 5, y + 20);
            }
            if (showAlbumPlaycount) {
              context.font = "18px Arial";
              context.shadowColor = "#2b2b2b";
              context.shadowBlur = 5;
              context.shadowOffsetX = 2;
              context.shadowOffsetY = 2;
              context.fillStyle = "white";
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
