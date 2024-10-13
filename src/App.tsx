import { getTopAlbums } from "./services/AlbumService";

function App() {
  return (
    <>
      <button
        onClick={() =>
          getTopAlbums({ user: "dandowski", period: "7day", limit: 5 })
        }
      >
        Get Top Albums
      </button>
    </>
  );
}

export default App;
