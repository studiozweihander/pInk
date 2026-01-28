import { DEFAULT_OG_IMAGE } from "../constants";

interface SEOData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
}

export const updateMetaTags = ({
  title,
  description,
  image,
  url,
  keywords,
}: SEOData) => {
  document.title = title;

  const metadata = {
    'meta[name="title"]': title,
    'meta[name="description"]': description,
    'meta[name="keywords"]':
      keywords || "quadrinhos, hqs, comics, download, ler online",
    'meta[property="og:title"]': title,
    'meta[property="og:description"]': description,
    'meta[property="og:image"]': image || DEFAULT_OG_IMAGE,
    'meta[property="og:url"]': url || window.location.href,
    'meta[name="twitter:card"]': "summary_large_image",
    'meta[name="twitter:title"]': title,
    'meta[name="twitter:description"]': description,
    'meta[name="twitter:image"]': image || DEFAULT_OG_IMAGE,
    'meta[name="twitter:url"]': url || window.location.href,
  };

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url || window.location.href);

  Object.entries(metadata).forEach(([selector, content]) => {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute("content", content);
    } else {
      const isProperty = selector.startsWith("meta[property=");
      const attr = isProperty ? "property" : "name";
      const name = selector.split('"')[1];

      const meta = document.createElement("meta");
      meta.setAttribute(attr, name);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  });
};
