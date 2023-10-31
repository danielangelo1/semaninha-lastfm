export default function saveValuesLocalStorage(
  userInput,
  timeRange,
  gridSize,
  showAlbumName,
  showAlbumPlaycount
) {
  {
    localStorage.setItem("userInput", userInput);
    localStorage.setItem("timeRange", timeRange);
    localStorage.setItem("gridSize", gridSize);
    localStorage.setItem("showAlbumName", showAlbumName);
    localStorage.setItem("showAlbumPlaycount", showAlbumPlaycount);
  }
}
