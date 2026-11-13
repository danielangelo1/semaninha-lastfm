import Article from "../../components/Article/Article";

const WhatIsAScrobble = () => (
  <Article
    id="scrobble"
    links={[
      { to: "/connect-your-player", labelKey: "articles.links.connectPlayer" },
      { to: "/", labelKey: "articles.links.generate" },
    ]}
  />
);

export default WhatIsAScrobble;
