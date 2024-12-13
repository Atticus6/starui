import { expect, test } from "vitest";
import { aaa } from ".";

test("test aaa 1+2=3", () => {
  expect(aaa(1, 2)).toBe(3);
});
