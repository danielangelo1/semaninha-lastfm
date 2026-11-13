import Article from "../../components/Article/Article";

const ConnectYourPlayer = () => (
  <Article
    id="connectPlayer"
    links={[
      { to: "/", labelKey: "articles.links.generate" },
      { to: "/what-is-a-scrobble", labelKey: "articles.links.scrobble" },
    ]}
  />
);

export default ConnectYourPlayer;
