import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveSiteUrl } from "@/data/site";

describe("resolveSiteUrl", () => {
  afterEach(() => vi.restoreAllMocks());

  it("utilise NEXT_PUBLIC_SITE_URL sans slash final", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://www.exemple.ma/" })).toBe(
      "https://www.exemple.ma",
    );
  });

  it("se replie sur les variables Vercel avec avertissement en production", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(
      resolveSiteUrl({
        NODE_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "fayou.vercel.app",
        VERCEL_URL: "preview.vercel.app",
      }),
    ).toBe("https://fayou.vercel.app");
    expect(warn).toHaveBeenCalledOnce();
    expect(resolveSiteUrl({ VERCEL_URL: "preview.vercel.app" })).toBe("https://preview.vercel.app");
  });

  it("retombe sur localhost, avec avertissement uniquement en production", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveSiteUrl({ NODE_ENV: "development" })).toBe("http://localhost:3000");
    expect(warn).not.toHaveBeenCalled();
    expect(resolveSiteUrl({ NODE_ENV: "production" })).toBe("http://localhost:3000");
    expect(warn).toHaveBeenCalledOnce();
  });
});
