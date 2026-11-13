import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import "./Article.css";

interface ArticleSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

interface ArticleContent {
  eyebrow: string;
  title: string;
  intro: string;
  sections: ArticleSection[];
}

export interface ArticleLink {
  to: string;
  labelKey: string;
}

interface ArticleProps {
  /** Key under "articles" in the locale files */
  id: string;
  links?: ArticleLink[];
}

/** Long-form text page (guides, about) whose content lives in the locale files */
const Article = ({ id, links = [] }: ArticleProps) => {
  const { t } = useTranslation();
  const content = t(`articles.${id}`, { returnObjects: true }) as ArticleContent;

  return (
    <main className="article">
      <div className="article-hero">
        <span className="article-eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </div>

      {content.sections.map((section) => (
        <section key={section.title} className="article-section">
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.items && (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {links.length > 0 && (
        <nav className="article-links" aria-label={t("articles.nextSteps")}>
          {links.map(({ to, labelKey }, index) => (
            <Link
              key={to}
              to={to}
              className={index === 0 ? "article-cta" : "article-link"}
            >
              {t(labelKey)}
              <ArrowRight size={index === 0 ? 16 : 14} weight="bold" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
    </main>
  );
};

export default Article;
