import fs from "fs";
import axios from "axios";

const BASE_URL = "https://bigsofatanzania.com";
const API_BASE_URL = "https://api.bigsofatanzania.com"; // your backend

async function generateSitemap() {
  // // 1️⃣ Fetch dynamic data
  // const products = await axios.get(`${API_BASE_URL}/products`);
  // const categories = await axios.get(`${API_BASE_URL}/categories`);

  // 2️⃣ Static pages
  const staticPages = [
    "",
    "/shop",
    "/interiors",
    "/furniture",
    "/office",
    "/living-room",
    "/dining",
    "/contact"
  ];

  // 3️⃣ Build URLs
  const urls = [
    ...staticPages.map(p => `${BASE_URL}${p}`),

    // ...categories.data.map(cat =>
    //   `${BASE_URL}/category/${cat.slug}`
    // ),

    // ...products.data.map(product =>
    //   `${BASE_URL}/product/${product.slug}`
    // )
  ];

  // 4️⃣ Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join("")}
</urlset>`;

  // 5️⃣ Save sitemap
  fs.writeFileSync("public/sitemap.xml", sitemap);

  console.log("✅ Sitemap generated successfully");
}

generateSitemap().catch(err => {
  console.error("❌ Sitemap generation failed:", err.message);
  process.exit(1);
});

