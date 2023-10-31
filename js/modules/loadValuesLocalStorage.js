export default function loadValuesLocalStorage() {
  const userInput = localStorage.getItem("userInput");
  const timeRange = localStorage.getItem("timeRange");
  const gridSize = localStorage.getItem("gridSize");
  const showAlbumName = localStorage.getItem("showAlbumName");
  const showAlbumPlaycount = localStorage.getItem("showAlbumPlaycount");

  if (userInput) {
    document.getElementById("userInput").value = userInput;
  }
  if (timeRange) {
    document.getElementById("timeRange").value = timeRange;
  }
  if (gridSize) {
    document.getElementById("gridSize").value = gridSize;
  }
  if (showAlbumName) {
    document.getElementById("showAlbumName").checked = showAlbumName;
  }
  if (showAlbumPlaycount) {
    document.getElementById("showAlbumPlaycount").checked = showAlbumPlaycount;
  }
}
