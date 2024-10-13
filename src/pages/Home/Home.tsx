import UserInput from "../../components/UserInput/UserInput";
import "./Home.css";

const Home = () => {
  return (
    <main>
      <p>
        Mostre que você tem o melhor gosto músical do mundo! Use o semaninha
        para gerar colagens com os seus albuns mais ouvidos do Last.fm
      </p>
      <UserInput />
    </main>
  );
};

export default Home;
