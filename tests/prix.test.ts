import { describe, expect, it } from "vitest";
import { formatPrix } from "@/lib/prix";

describe("formatPrix", () => {
  it("formate en DH avec espaces insécables", () => {
    expect(formatPrix(17000)).toBe("17 000 DH");
    expect(formatPrix(6000)).toBe("6 000 DH");
    expect(formatPrix(950)).toBe("950 DH");
  });
  it("laisse « Sur devis » tel quel", () => {
    expect(formatPrix("Sur devis")).toBe("Sur devis");
  });
});
