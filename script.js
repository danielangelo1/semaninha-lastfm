const gridWidth = 3; // Largura padrão do grid
const gridHeight = 3; // Altura padrão do grid

function generateGrid() {
  const userInput = document.getElementById("userInput").value;
  const timeRange = document.getElementById("timeRange").value;
  const gridSize = document.getElementById("gridSize").value;
  const gridType = document.getElementById("gridType").value; // Adicionado novo campo para obter o tipo de grid
  const albumGrid = document.getElementById("albumGrid");

  // Fazer requisição à API do Last.fm com os parâmetros escolhidos pelo usuário
  // (usando a biblioteca fetch ou outra de sua preferência)
  // Exemplo:
  let apiMethod = "";
  if (gridType === "albums") {
    apiMethod = "user.getTopAlbums";
  } else if (gridType === "artists") {
    apiMethod = "user.getTopArtists"; // Alterado para obter top artistas
  }

  fetch(
    `https://ws.audioscrobbler.com/2.0/?method=${apiMethod}&user=${userInput}&period=${timeRange}&api_key=e713e4ee81e3cfee0417956233a9faa1&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      albumGrid.innerHTML = ""; // Limpar o grid de imagens

      // Calcular o número total de células no grid com base no tamanho escolhido
      const totalCells = gridSize * gridSize;

      // Iterar pelos álbuns ou artistas retornados pela API e criar elementos de imagem para exibir no grid
      if (gridType === "albums") {
        data.topalbums.album.slice(0, totalCells).forEach((album) => {
          const img = document.createElement("img");
          img.src = album.image[2]["#text"]; // Usar a imagem de tamanho médio
          img.alt = album.name;
          img.className = "album-image"; // Adicionar classe para aplicar estilo CSS
          albumGrid.appendChild(img);
          console.log(data);
        });
      } else if (gridType === "artists") {
        data.topartists.artist.slice(0, totalCells).forEach((artist) => {
          const img = document.createElement("img");
          img.src = artist.image[2]["#text"]; // Usar a imagem de tamanho médio
          img.alt = artist.name;
          img.className = "album-image"; // Adicionar classe para aplicar estilo CSS
          albumGrid.appendChild(img);
          console.log(data);
        });
      }

      // Definir a largura e altura do grid com base no tamanho escolhido
      albumGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      albumGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

      // Mostrar o botão de download
      const downloadButton = document.getElementById("downloadButton");
      downloadButton.style.display = "block";
    })
    .catch((error) => {
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
      link.href = dataUrl;
      link.download = "albumGrid.png";
      document.body.appendChild(link); // Adicionar o link ao corpo do documento para que seja clicável
      link.click(); // Simular o clique no link para iniciar o download
      document.body.removeChild(link); // Remover o link do corpo do documento após o download
    })
    .catch(function (error) {
      console.error("Erro ao gerar a imagem do grid:", error);
    });
}
