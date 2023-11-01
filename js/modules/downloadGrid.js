export default function initDownloadGrid() {
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

  const downloadButton = document.getElementById("downloadButton");
  downloadButton.addEventListener("click", downloadGrid);
}
