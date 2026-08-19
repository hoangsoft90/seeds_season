/**
 * Dynamic sitemap (change seo-basics).
 *
 * Liệt kê tất cả trang public: homepage + 15 crop detail + /first-aid.
 * Exclude: /api/*, /sign-in, /sign-up, /garden (authenticated).
 */

import type { MetadataRoute } from "next";
import { getAllCrops } from "@/lib/data/crops";

const BASE_URL = "https://tronggihomnay.vn";

export default function sitemap(): MetadataRoute.Sitemap {
  const crops = getAllCrops().map((c) => ({
    url: `${BASE_URL}/crops/${c.crop_base.id}`,
    lastModified: new Date(c.crop_base.data_provenance.last_verified_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...crops,
    {
      url: `${BASE_URL}/first-aid`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
