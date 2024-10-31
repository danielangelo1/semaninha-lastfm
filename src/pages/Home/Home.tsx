import { useEffect } from "react";
import UserInput from "../../components/UserInput/UserInput";
import "./Home.css";
import { getArtistImageScraper } from "../../services/scraper";

const Home = () => {
  useEffect(() => {
    getArtistImageScraper("https://www.last.fm/music/Queen").then((image) => {
      console.log(image);
    });
  }, []);
  return (
    <main className="home">
      <p>
        Mostre que você tem o melhor gosto músical do mundo! Use o semaninha
        para gerar colagens com os seus albuns mais ouvidos do Last.fm
      </p>
      <UserInput />
    </main>
  );
};

export default Home;
