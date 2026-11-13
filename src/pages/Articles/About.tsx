import Article from "../../components/Article/Article";

const About = () => (
  <Article
    id="about"
    links={[
      { to: "/", labelKey: "articles.links.generate" },
      { to: "/how-to-use", labelKey: "articles.links.howToUse" },
      { to: "/support", labelKey: "articles.links.support" },
    ]}
  />
);

export default About;
