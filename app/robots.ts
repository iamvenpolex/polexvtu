import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: ["/admin"],
      },
    ],
    sitemap: "https://tapam.mipitech.com.ng/sitemap.xml",
  };
}
