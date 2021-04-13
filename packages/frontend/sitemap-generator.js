const sitemap = require("nextjs-sitemap-generator");

sitemap({
  baseUrl: process.env.NEXT_PUBLIC_URL,
  pagesDirectory: __dirname + "/.next/serverless/pages",
  targetDirectory: "public/",
  extraPaths: ["/"],
  ignoredExtensions: ["js", "map"],
  ignoredPaths: ["assets", "[roomName]", "index"],
  nextConfigPath: __dirname + "/next.config.js",
});
