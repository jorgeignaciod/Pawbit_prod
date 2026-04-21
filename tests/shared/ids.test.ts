import { describe, expect, it } from "vitest";

import { createToken } from "@/server/shared/ids";

describe("createToken", () => {
  it("genera tokens con prefijo estable", () => {
    const token = createToken("user");

    expect(token.startsWith("user_")).toBe(true);
  });

  it("genera valores distintos en llamadas consecutivas", () => {
    expect(createToken("pet")).not.toBe(createToken("pet"));
  });
});
