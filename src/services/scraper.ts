import axios from "axios";
import { load } from "cheerio";

export const getArtistImageScraper = async (artistURL: string) => {
  const { data } = await axios.get(`${artistURL}/+images`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    },
  });
  const $ = load(data);
  const image = $(".image-list-item-wrapper").first().find("a").attr("href");

  const imageId = image?.split("/").pop();
  return `https://lastfm.freetls.fastly.net/i/u/300x300/${imageId}`;
};
