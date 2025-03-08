import fs from "fs";
import path from "path";

const baseUrl = "https://lsneakers.vercel.app";

const pages = [
  "/",
  "/collections/hombre",
  "/collections/mujer",
  "/collections/ninos",
  "/collections/promociones",
  "/admin-login",
  "/admin",
  "/add-product",
  "/update-products",
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
</urlset>`;

const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");

fs.writeFileSync(sitemapPath, sitemapContent, "utf8");

console.log("✅ Sitemap generado en:", sitemapPath);
